import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

export function UserMessageBlock({
  message,
}: {
  message: {
    content: string;
  };
}) {
  return (
    <div className="flex flex-row-reverse ">
      <p className="px-6 py-4 max-w-[70%] rounded-lg bg-secondary">
        <Latex>{message.content}</Latex>
      </p>
    </div>
  );
}

export function AssistantMessageBlock({
  message,
}: {
  message: { content: string };
}) {
  return (
    <div className="flex flex-row max-w-[70%] p-4">
      <Latex>{message.content}</Latex>
    </div>
  );
}
