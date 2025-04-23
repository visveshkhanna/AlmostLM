import { getSummaryForSource } from "@/lib/ai-helper";
import { db } from "@/lib/postgres/db";
import { addToVectorStore } from "@/lib/postgres/upstash";
import { getTextFromFile, uploadFileToS3 } from "@/lib/server-utils";

import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const body = await req.formData();
  const notebookId = body.get("notebookId");
  const file = body.get("file") as File;

  if (!notebookId || !file) {
    return Response.json(
      { error: "Missing notebookId or file" },
      { status: 400 }
    );
  }

  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: {
      externalUserId: userId,
    },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 401 });
  }

  const notebook = await db.notebook.findUnique({
    where: {
      id: notebookId as string,
    },
  });

  if (!notebook) {
    return Response.json({ error: "Notebook not found" }, { status: 404 });
  }

  const { url } = await uploadFileToS3(file, "sources");

  const { text, type } = await getTextFromFile(file);

  const summary = await getSummaryForSource(
    text as string,
    file.name,
    file.type
  );

  if (notebook.title === "Untitled Notebook") {
    console.log("Updating notebook title");
    await db.notebook.update({
      where: {
        id: notebookId as string,
      },
      data: {
        title: summary?.title || "Untitled Notebook",
      },
    });
  }

  const source = await db.source.create({
    data: {
      contentUrl: url,
      fileType: type as string,
      name: file.name,
      notebookId: notebookId as string,
      textContent: text as string,
      summary: {
        create: {
          title: summary?.title || "No title",
          description: summary?.description || "No description",
          keyTopics: summary?.keyTopics || [],
        },
      },
    },
  });

  await addToVectorStore(notebookId as string, source.id, text as string);

  return Response.json(source, { status: 201 });
}
