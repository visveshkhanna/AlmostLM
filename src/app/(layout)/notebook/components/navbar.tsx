import { Button } from "@/components/ui/button";
import UserProfile from "@/components/user-profile";
import { Share2 } from "lucide-react";
import { NotebookData } from "../data";

export default function Navbar({ id }: { id: string }) {
  return (
    <div className="flex justify-between w-full items-center gap-4 p-4 border-b">
      <div>{NotebookData.title}</div>

      <div className="flex items-center gap-2">
        <Button
          variant={"outline"}
          className="rounded-full flex items-center gap-2"
        >
          <Share2 />
          <p>Share</p>
        </Button>
        <UserProfile />
      </div>
    </div>
  );
}
