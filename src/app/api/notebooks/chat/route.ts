import { db } from "@/lib/postgres/db";
import { vectorStore } from "@/lib/postgres/upstash";
import { auth } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await db.user.findUnique({
    where: {
      externalUserId: userId,
    },
  });

  if (!user) {
    return new Response("User not found", { status: 401 });
  }

  const body = await req.json();

  const messages = body.messages;
  const notebookId = body.notebookId;
  const sources = body.sources.split(",");
  const query = body.query;

  const notebook = await db.notebook.findUnique({
    where: {
      id: notebookId,
      userId: user.id,
    },
  });

  if (!notebook) {
    return new Response("Notebook not found", { status: 404 });
  }

  const results = await vectorStore.query({
    data: query,
    filter:
      sources.length === 0
        ? undefined
        : sources[0] === "all"
        ? `notebookId = '${notebookId}'`
        : `notebookId = '${notebookId}' AND sourceId IN (${sources
            .map((s: string) => `'${s}'`)
            .join(",")})`,
    topK: 5,
    includeData: true,
    includeMetadata: true,
  });

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: `
        You are a helpful assistant that can answer questions about the following sources:

        Respond in latex format. do not use markdown.

        ${results.map((result) => result.data).join("\n")}
        `,
      },
      ...messages,
    ],
  });

  return result.toDataStreamResponse({});
}
