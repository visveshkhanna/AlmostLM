import { Separator } from "@/components/ui/separator";
import NotebooksList from "./components/notebooks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center w-full justify-center h-full">
      <div className="flex flex-col w-[80%] gap-4">
        <p className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
          Welcome to AlmostLM
        </p>
        <div className="flex items-center justify-between w-full">
          <p className="text-3xl">My notebooks</p>
          <Button className="md:hidden flex items-center gap-2">
            <Plus />
          </Button>
        </div>
        <Separator />
        <NotebooksList />
      </div>
    </div>
  );
}
