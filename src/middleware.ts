import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const IGNORED_PATHS = ["/api/webhooks/clerk"];

export default clerkMiddleware(async (auth, request) => {
  if (IGNORED_PATHS.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
