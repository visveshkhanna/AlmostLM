import { Loader2 } from "lucide-react";

export default function NewNotebookPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center w-full gap-4">
        <p className="text-lg">AlmostLM is creating your notebook...</p>
        <Loader2 className="animate-spin" />
      </div>
    </div>
  );
}
