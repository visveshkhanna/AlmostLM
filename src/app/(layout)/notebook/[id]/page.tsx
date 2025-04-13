"use client";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Clipboard,
  Copy,
  Dock,
  HardDrive,
  Lightbulb,
  Link2,
  Search,
  Sliders,
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
    <>
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
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
      <div>{params.id}</div>
    </>
  );
}
