import { db } from "@/lib/postgres/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  const queryParams = new URL(req.url).searchParams;
  const sourceId = queryParams.get("id");

  if (!sourceId) {
    return new Response("Source ID is required", { status: 400 });
  }

  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { externalUserId: userId },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const source = await db.source.findUnique({
    where: { id: sourceId },
    select: {
      summary: true,
      textContent: true,
    },
  });

  if (!source) {
    return new Response("Source not found", { status: 404 });
  }

  return Response.json(
    {
      ...source.summary,
      textContent: source.textContent,
    },
    { status: 200 }
  );
}
