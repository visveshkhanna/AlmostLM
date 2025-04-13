import { UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Video } from "lucide-react";
import { ModeToggle } from "./dark-mode-toggle";

export default function UserProfile() {
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
      <UserButton />
    </div>
  );
}
