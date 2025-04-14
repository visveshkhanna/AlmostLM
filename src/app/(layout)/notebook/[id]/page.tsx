"use client";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Clipboard,
  Copy,
  Dock,
  DockIcon,
  EllipsisVertical,
  GraduationCap,
  HardDrive,
  Info,
  Lightbulb,
  Link2,
  NotepadText,
  PanelLeft,
  Plus,
  Search,
  Sliders,
  Speaker,
  TableOfContents,
  TrendingUp,
  Upload,
} from "lucide-react";
import { useState } from "react";

function SourceCard({
  icon,
  title,
  buttons,
}: {
  icon: React.ReactNode;
  title: string;
  buttons: React.ReactNode;
}) {
  return (
    <div className="border p-4 rounded-lg flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm">{title}</p>
      </div>
      <div className="flex gap-2">{buttons}</div>
    </div>
  );
}

export default function NotebookPage({ params }: { params: { id: string } }) {
  const [file, setFile] = useState<File | null>(null);
  const [dialogOpen, setDialogOpen] = useState(true);
  const [dialogOpen2, setDialogOpen2] = useState(false);

  return (
    <div className="grid grid-cols-4 gap-4 w-full h-full p-4">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex flex-col gap-4 px-10 max-w-5xl">
          <div className="flex justify-between items-center">
            <div>
              <Logo />
            </div>
          </div>

          {/* Add Sources */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">
              <p className="text-xl">Add Sources</p>
              <Button
                className="flex items-center gap-2 px-8 rounded-full"
                onClick={() => {
                  setDialogOpen2(true);
                }}
              >
                <Search />
                <p className="font-semibold">Discover sources</p>
              </Button>
            </div>
          </div>

          {/* Sources description */}
          <div>
            <p>
              Sources let AlmostLM base its responses on the information that
              matters most to you.{" "}
            </p>
            <p>
              (Examples: marketing plans, course reading, research notes,
              meeting transcripts, sales documents, etc.)
            </p>
          </div>

          {/* Upload Sources */}
          <div className="text-sm w-full border-2 border-dashed flex flex-col items-center p-4 py-8 gap-2">
            <div className="p-4 bg-[#e5efff] rounded-full">
              <Upload color="#4259ff" />
            </div>
            <p className="font-semibold">Upload sources</p>
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  const file = e.target.files[0];
                  if (file) {
                    setFile(file);
                  }
                }
              }}
            />
            <p className="text-muted-foreground">
              Drag and drop or{" "}
              <span className="text-[#4259ff] font-semibold cursor-pointer">
                choose file
              </span>{" "}
              to upload
            </p>
            <p className="text-muted-foreground mt-8">
              Supported file types: PDF, .txt, Markdown, Audio (e.g. mp3)
            </p>
          </div>

          {/* Sources */}
          <div className="grid grid-cols-2 w-full lg:grid-cols-3 gap-4">
            <SourceCard
              icon={<HardDrive size={20} />}
              title="Google Drive"
              buttons={
                <Button
                  variant={"secondary"}
                  className="flex items-center gap-2"
                >
                  <Dock />
                  <p>Google Docs</p>
                </Button>
              }
            />
            <SourceCard
              icon={<Link2 size={20} />}
              title="Link"
              buttons={
                <div className="flex gap-2 flex-col">
                  <Button
                    variant={"secondary"}
                    className="flex items-center gap-2"
                  >
                    <Dock />
                    <p>Google Docs</p>
                  </Button>
                  <Button
                    variant={"secondary"}
                    className="flex items-center gap-2"
                  >
                    <Sliders />
                    <p>Google Slides</p>
                  </Button>
                </div>
              }
            />
            <SourceCard
              icon={<Clipboard size={20} />}
              title="Paste text"
              buttons={
                <Button
                  variant={"secondary"}
                  className="flex items-center gap-2"
                >
                  <Copy />
                  <p>Copied Text</p>
                </Button>
              }
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={dialogOpen2} onOpenChange={setDialogOpen2}>
        <DialogContent className="flex flex-col gap-4 px-10 w-full max-w-3xl">
          {/* Add Sources */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">
              <p className="text-xl">Add Sources</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 items-center pt-12 relative overflow-hidden">
            <div className="p-4 bg-[#e5efff] rounded-full w-fit">
              <Search color="#4259ff" />
            </div>
            <p className="font-semibold text-lg">What are you interested in?</p>
            <textarea
              rows={10}
              maxLength={400}
              placeholder="Describe something that you'd like to learn abour or click 'I'm feeling curious' to explore a new topic."
              className="p-2 rounded-lg border w-full h-full"
            />
          </div>
          <div className="flex items-center flex-row-reverse w-full gap-4">
            <Button className="rounded-full">Submit</Button>
            <Button
              variant={"secondary"}
              className="rounded-full flex items-center gap-2"
            >
              <Lightbulb />
              <p>I&apos;m feeling curious</p>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col h-full w-full rounded-lg border gap-4">
        <div className="border-b py-2 flex justify-between items-center gap-4 px-4">
          <p className="font-semibold">Sources</p>
          <Button variant={"ghost"} size={"icon"}>
            <PanelLeft />
          </Button>
        </div>
        <div className="grid grid-cols-2 w-full px-4 gap-4">
          <Button
            variant={"outline"}
            className="flex rounded-full items-center gap-2"
          >
            <Plus />
            <p>Add</p>
          </Button>
          <Button
            variant={"outline"}
            className="flex rounded-full items-center gap-2"
          >
            <Search />
            <p>Discover</p>
          </Button>
        </div>
      </div>

      <div className="col-span-2 flex flex-col h-full w-full rounded-lg border gap-4">
        <div className="border-b py-2 flex justify-between items-center gap-4 px-4">
          <p className="font-semibold">Chat</p>
        </div>
      </div>
      <div className="flex flex-col h-full w-full rounded-lg border gap-4">
        <div className="border-b py-2 flex justify-between items-center gap-4 px-4">
          <p className="font-semibold">Studio</p>
          <Button variant={"ghost"} size={"icon"}>
            <PanelLeft />
          </Button>
        </div>
        <div className="flex flex-col gap-4 px-4 py-4 pb-8 border-b">
          <div className="flex justify-between items-center gap-4">
            <p className="font-semibold">Audio Overview</p>
            <Button variant={"ghost"} size={"icon"}>
              <Info />
            </Button>
          </div>
          <div className="flex flex-col gap-6 w-full h-full">
            <div className="flex gap-2 items-center">
              <div className="p-4 rounded-full bg-secondary">
                <Speaker />
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <p className="font-semibold">Deep Dive coversation </p>
                <p>Two hosts (English only)</p>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2 w-full">
              <Button variant={"outline"} className="w-full rounded-full">
                Customize
              </Button>
              <Button variant={"default"} className="w-full rounded-full">
                Generate
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-between items-center gap-4">
            <p className="font-semibold">Notes</p>
            <Button variant={"ghost"} size={"icon"}>
              <EllipsisVertical />
            </Button>
          </div>

          <div className="grid grid-cols-2 grid-rows-1 gap-4">
            <Button
              variant={"outline"}
              className="col-span-2 flex rounded-full items-center gap-2"
            >
              <Plus />
              <p>Add note</p>
            </Button>
            <Button
              variant={"outline"}
              className="flex rounded-full items-center gap-2"
            >
              <GraduationCap />
              <p>Study guide</p>
            </Button>
            <Button
              variant={"outline"}
              className="flex rounded-full items-center gap-2"
            >
              <DockIcon />
              <p>Briefing Doc</p>
            </Button>
            <Button
              variant={"outline"}
              className="flex rounded-full items-center gap-2"
            >
              <TableOfContents />
              <p>FAQ</p>
            </Button>
            <Button
              variant={"outline"}
              className="flex rounded-full items-center gap-2"
            >
              <TrendingUp />
              <p>Timeline</p>
            </Button>
          </div>

          <div className="py-[50px] text-muted-foreground flex flex-col items-center justify-center h-full w-full">
            <NotepadText size={40} />
            <div className="flex items-center flex-col gap-1 py-4">
              <p>Saved notes will appear here</p>
              <p>
                Save a chat message to create a new note or click Add note
                above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
