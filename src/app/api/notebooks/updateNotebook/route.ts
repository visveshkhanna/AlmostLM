import { db } from "@/lib/postgres/db";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: Request) {
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
    return new Response("User not found", { status: 401 });
  }

  const notebook = await db.notebook.findUnique({
    where: {
      id: notebookId as string,
      userId: user.id,
    },
  });

  if (!notebook) {
    return new Response("Notebook not found", { status: 404 });
  }

  const body = await req.json();

  if (!body.title) {
    return new Response("Title is required", { status: 400 });
  }

  await db.notebook.update({
    where: { id: notebookId as string, userId: user.id },
    data: { title: body.title },
  });

  return Response.json({ message: "Notebook updated" }, { status: 200 });
}
