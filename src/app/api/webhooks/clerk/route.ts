import { db } from "@/lib/postgres/db";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(req: Request) {
  console.log("Received webhook");

  try {
    const evt = await verifyWebhook(req);

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { email_addresses, id, first_name, last_name } = evt.data;

      const fullName =
        first_name && last_name
          ? `${first_name} ${last_name}`
          : email_addresses[0].email_address;

      await db.user.create({
        data: {
          externalUserId: id,
          name: fullName,
          email: email_addresses[0].email_address,
        },
      });
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
