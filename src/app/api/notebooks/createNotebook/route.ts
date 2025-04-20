import { db } from "@/lib/postgres/db";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
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
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const notebook = await db.notebook.create({
    data: {
      userId: user.id,
      title: "Untitled Notebook",
    },
  });

  return Response.json(notebook);
}
