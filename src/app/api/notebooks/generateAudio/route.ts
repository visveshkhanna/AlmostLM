import { openai } from "@/lib/openai";
import { db } from "@/lib/postgres/db";
import { auth } from "@clerk/nextjs/server";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

import { fal } from "@fal-ai/client";

export async function POST(req: Request) {
  const { notebookId, sources } = await req.json();

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

  const notebook = await db.notebook.findUnique({
    where: {
      id: notebookId,
    },
  });

  if (!notebook) {
    return new Response("Notebook not found", { status: 404 });
  }

  const _sources = await db.source.findMany({
    where: {
      id: {
        in: sources.split(","),
      },
    },
    select: {
      summary: {
        select: {
          title: true,
          description: true,
          keyTopics: true,
        },
      },
    },
  });

  const responseFormat = z.object({
    conversation: z.array(
      z.object({
        speaker: z.enum(["2", "1"]),
        content: z.string(),
      })
    ),
  });

  const response = await openai.beta.chat.completions.parse({
    model: "meta-llama/llama-3-70b-instruct",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that takes in multiple source's title, and description. and generate a conversation between two people discussing about the topics included in the sources. 
          
          ***You need to provide the conversation between two people discussing about the topics included in the sources***`,
      },
      {
        role: "user",
        content: `sources: ${JSON.stringify(_sources)}`,
      },
    ],
    response_format: zodResponseFormat(responseFormat, "conversation"),
  });

  const conversation = response.choices[0].message.parsed;

  if (!conversation) {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }

  const content = `${conversation.conversation
    .map((c) => `Speaker ${c.speaker}: ${c.content}`)
    .join("\n")}`;

  const result = await fal.subscribe("fal-ai/playai/tts/dialog", {
    input: {
      input: content,
      voices: [
        {
          voice: "Jennifer (English (US)/American)",
          turn_prefix: "Speaker 1: ",
        },
        {
          voice: "Furio (English (IT)/Italian)",
          turn_prefix: "Speaker 2: ",
        },
      ],
      response_format: "url",
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        update.logs.map((log) => log.message).forEach(console.log);
      }
    },
  });

  const audioUrl = result.data.audio.url;

  const audio = await db.audio.create({
    data: {
      audioUrl: audioUrl,
      notebookId: notebookId,
    },
  });

  return Response.json({ audio: audio.audioUrl }, { status: 200 });
}
