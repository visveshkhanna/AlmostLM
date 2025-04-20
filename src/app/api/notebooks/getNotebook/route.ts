import { db } from "@/lib/postgres/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  const queryParams = new URL(req.url).searchParams;
  const notebookId = queryParams.get("id");

  if (!notebookId) {
    return new Response("Notebook ID is required", { status: 400 });
  }

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
    return new Response("User not found", { status: 404 });
  }

  if (!notebookId) {
    return new Response("Notebook ID is required", { status: 400 });
  }

  const notebook = await db.notebook.findUnique({
    where: { id: notebookId },
    select: {
      title: true,
      sources: true,
      audio: true,
      conversation: true,
    },
  });

  if (!notebook) {
    return new Response("Notebook not found", { status: 404 });
  }

  const source = await db.source.findMany({
    where: {
      notebookId: notebookId,
    },
    select: {
      summary: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return Response.json(
    {
      ...notebook,
      title:
        notebook.title ||
        (source && source.length > 0 ? source[0].summary?.title : ""),
      description:
        source && source.length > 0 ? source[0].summary?.description : "",
    },
    { status: 200 }
  );
}
