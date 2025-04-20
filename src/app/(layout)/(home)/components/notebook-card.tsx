import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Notebook } from "@/lib/types";
import { getDeterministicGradient } from "@/lib/utils";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useMemo, useEffect, useState } from "react";

export default function NotebookCard({ notebook }: { notebook: Notebook }) {
  // Generate deterministic gradient based on notebook id
  const gradient = useMemo(
    () => getDeterministicGradient(notebook.id),
    [notebook.id]
  );
  const [isLightMode, setIsLightMode] = useState(false);

  // Detect light/dark mode on the client side
  useEffect(() => {
    setIsLightMode(!document.documentElement.classList.contains("dark"));

    // Optional: Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsLightMode(!document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <Link
      href={`/notebook/${notebook.id}`}
      className="group flex flex-col w-full"
    >
      <div className="relative flex flex-col h-[220px] w-auto rounded-lg p-4 overflow-hidden">
        {/* Full coverage gradient with blur */}
        <div
          className="absolute inset-0"
          style={{
            background: gradient,
            opacity: 0.8,
          }}
        />

        {/* Blur overlay at the top */}
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{
            height: "40%",
          }}
        />

        {/* Semi-transparent overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: isLightMode
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.2)",
          }}
        ></div>

        {/* Content */}
        <div className="relative flex w-full flex-col justify-between h-full z-10">
          <div className="flex w-full items-center gap-4 justify-between">
            <div className="rounded-full hover:bg-white/10 p-2">
              <p className="text-3xl">👋🏻</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="hover:bg-white/10 rounded-full p-2">
                  <EllipsisVertical size={24} className="text-white" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Trash size={24} />
                  <p>Delete</p>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pencil size={24} />
                  <p>Edit</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex w-full flex-col gap-2">
            <p className="text-xl text-white">{notebook.title}</p>
            <p className="text-sm text-white">
              {new Date(notebook.createdAt).toLocaleDateString()}{" "}
              {notebook._count.sources} sources
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
