"use client";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Video } from "lucide-react";
import { ModeToggle } from "./dark-mode-toggle";
import { useUser } from "@clerk/nextjs";

export default function UserProfile() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex gap-4 items-center">
      <Button
        variant={"outline"}
        className="rounded-full flex items-center gap-2"
      >
        <Video />
        <p>Watch Demo</p>
      </Button>
      <ModeToggle />
      {isSignedIn ? (
        <UserButton />
      ) : (
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      )}
    </div>
  );
}
