import { db } from "@/lib/postgres/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
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

  const notebooks = await db.notebook.findMany({
    where: {
      userId: user.id,
    },
    include: {
      _count: {
        select: {
          sources: true,
        },
      },
    },
  });

  return Response.json(notebooks);
}
