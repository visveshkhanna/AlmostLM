"use client";
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Select } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { Check, Grid2X2, Menu, Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import NotebookCard from "./notebook-card";

const FILTERS = ["Most Recent", "Title", "Shared with me"];

export default function NotebooksList() {
  const [filter, setFilter] = useState("0");
  const [view, setView] = useState("grid");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center w-full gap-4">
        <Button className="hidden md:flex rounded-full items-center gap-2">
          <Plus />
          <p>Create new</p>
        </Button>
        <div className="justify-between w-full lg:w-fit lg:justify-start flex items-center gap-2 cursor-pointer">
          <div className="relative overflow-hidden flex items-center border rounded-full">
            <div
              className={cn(
                "p-3 flex items-center gap-2 transition-all duration-300 ease-in-out relative z-10",
                {
                  "text-primary-foreground": view === "grid",
                }
              )}
              onClick={() => setView("grid")}
            >
              {view === "grid" && (
                <Check className="animate-in fade-in duration-300" />
              )}
              <Grid2X2 />
            </div>

            <div
              className={cn(
                "p-3 flex items-center gap-2 transition-all duration-300 ease-in-out relative z-10",
                {
                  "text-primary-foreground": view === "list",
                }
              )}
              onClick={() => setView("list")}
            >
              {view === "list" && (
                <Check className="animate-in fade-in duration-300" />
              )}
              <Menu />
            </div>
            <div
              className={cn(
                "absolute top-0 bottom-0 z-0 bg-muted transition-all duration-300 ease-in-out rounded-full",
                view === "grid" ? "left-0" : "right-0"
              )}
              style={{ width: "50%" }}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select Filter" />
            </SelectTrigger>
            <SelectContent>
              {FILTERS.map((filter, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {filter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-4">
        <NotebookCard id="1" />
        <NotebookCard id="2" />
        <NotebookCard id="3" />
        <NotebookCard id="4" />
        <NotebookCard id="5" />
        <NotebookCard id="6" />
      </div>
    </div>
  );
}
