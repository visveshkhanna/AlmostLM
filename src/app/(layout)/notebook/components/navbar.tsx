"use client";
import { Button } from "@/components/ui/button";
import UserProfile from "@/components/user-profile";
import { Home, Share2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Navbar({ id, name }: { id: string; name: string }) {
  const [title, setTitle] = useState(name);
  const initialTitle = useRef(name);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTitle(name);
    initialTitle.current = name;
  }, [name]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (title !== initialTitle.current) {
      timeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `/api/notebooks/updateNotebook?id=${id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ title }),
            }
          );

          if (!response.ok) {
            console.error("Failed to update notebook title");
          } else {
            initialTitle.current = title;
          }
        } catch (error) {
          console.error("Error updating notebook title:", error);
        }
      }, 4000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [title, id]);

  return (
    <div className="flex justify-between w-full items-center gap-4 p-4 border-b">
      <Link href={"/"}>
        <Button variant={"outline"} size={"icon"} className="rounded-full">
          <Home />
        </Button>
      </Link>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled Notebook"
        className="w-full"
      />

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
