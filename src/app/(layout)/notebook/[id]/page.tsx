"use client";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Clipboard,
  Copy,
  Dock,
  DockIcon,
  EllipsisVertical,
  FileAudio,
  GraduationCap,
  HardDrive,
  Info,
  Lightbulb,
  Link2,
  Map,
  Notebook,
  NotepadText,
  PanelLeft,
  Paperclip,
  Pin,
  Plus,
  Search,
  Send,
  Sliders,
  Speaker,
  StickyNote,
  TableOfContents,
  TrendingUp,
  Upload,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import React, { useState } from "react";
import Navbar from "../components/navbar";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  AssistantMessageBlock,
  UserMessageBlock,
} from "../components/message-block";
import { useChat } from "@ai-sdk/react";

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

const ICONS: Record<string, React.ReactNode> = {
  pdf: <StickyNote size={18} />,
  audio: <Speaker size={18} />,
  text: <Clipboard size={18} />,
  any: <Loader2 size={18} />,
};

export default function NotebookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [dialogOpen, setDialogOpen] = useState(true);
  const [dialogOpen2, setDialogOpen2] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<{
    id: string;
    name: string;
    fileType: string;
    contentUrl: string;
  } | null>(null);
  const [sourceContent, setSourceContent] = useState<{
    title: string;
    description: string;
    keyTopics: string[];
    textContent: string;
  } | null>(null);
  const [isLoadingSource, setIsLoadingSource] = useState(false);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [sources, setSources] = useState<
    {
      id: string;
      name: string;
      fileType: string;
      contentUrl: string;
    }[]
  >([]);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const { id } = React.use(params);

  const [parent] = useAutoAnimate();

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/notebooks/chat",
  });

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["notebook", id],
    queryFn: async () => {
      const res = await fetch(`/api/notebooks/getNotebook?id=${id}`);
      const data = await res.json();
      setSources(
        data.sources.map(
          (source: {
            id: string;
            name: string;
            fileType: string;
            contentUrl: string;
          }) => ({
            id: source.id,
            name: source.name,
            fileType: source.fileType,
            contentUrl: source.contentUrl,
          })
        )
      );
      return data;
    },
  });

  const handleAddSource = async (file: File) => {
    setIsAddingSource(true);
    const formData = new FormData();
    formData.append("notebookId", id);
    formData.append("file", file);

    setSources((prev) => [
      ...prev,
      { id: "any", name: file.name, fileType: "any", contentUrl: "" },
    ]);

    try {
      const res = await fetch("/api/sources/addSource", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const newSource = await res.json();
        setSources((prev) => [
          ...prev,
          {
            id: newSource.id,
            name: newSource.name,
            fileType: newSource.fileType,
            contentUrl: newSource.contentUrl,
          },
        ]);
        setFile(null);
        await refetch();
      }
    } catch (error) {
      console.error("Error adding source:", error);
    } finally {
      setIsAddingSource(false);
    }
  };

  const handleSourceClick = async (source: {
    id: string;
    name: string;
    fileType: string;
    contentUrl: string;
  }) => {
    setSelectedSource(source);
    setIsLoadingSource(true);
    try {
      const res = await fetch(`/api/sources/getSource?id=${source.id}`);
      if (res.ok) {
        const data = await res.json();
        setSourceContent(data);
      }
    } catch (error) {
      console.error("Error fetching source:", error);
    } finally {
      setIsLoadingSource(false);
    }
  };

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    const res = await fetch(`/api/notebooks/generateAudio`, {
      method: "POST",
      body: JSON.stringify({
        notebookId: id,
        sources: selectedSources.join(","),
      }),
    });
    if (res.ok) {
      await refetch();
    }
    setIsGeneratingAudio(false);
  };

  if (isLoading || !data) {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-col h-full gap-2 w-full items-center justify-center">
          <Loader2 className="animate-spin" size={40} />
          <p className="text-muted-foreground">
            Loading your notebook... (or maybe our hamsters are just taking a
            coffee break) 🐹☕️
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <Navbar id={id} name={data.title} />
      <div className="grid grid-cols-6 gap-4 w-full h-[calc(100%-60px)] p-4 overflow-hidden">
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

            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  const file = e.target.files[0];
                  if (file) {
                    setFile(file);
                  }
                  setDialogOpen(false);
                  handleAddSource(file);
                }
              }}
            />

            {/* Upload Sources */}
            <label
              htmlFor="file-upload"
              className="text-sm w-full border-2 border-dashed flex flex-col items-center p-4 py-8 gap-2"
            >
              {file ? (
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="p-4 bg-[#e5efff] rounded-full">
                    <Paperclip color="#4259ff" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-[#e5efff] rounded-full">
                    <Upload color="#4259ff" />
                  </div>
                  <p className="font-semibold">Upload sources</p>
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
                </>
              )}
            </label>

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
              <p className="font-semibold text-lg">
                What are you interested in?
              </p>
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
        <div
          ref={parent}
          className={cn(
            "col-span-2 flex flex-col h-full w-full rounded-lg border gap-4 overflow-hidden"
          )}
        >
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
              onClick={() => {
                setDialogOpen(true);
              }}
            >
              <Plus />
              <p>Add</p>
            </Button>
            <Button
              variant={"outline"}
              className="flex rounded-full items-center gap-2"
              onClick={() => {
                setDialogOpen2(true);
              }}
            >
              <Search />
              <p>Discover</p>
            </Button>
          </div>

          {/* Sources List */}
          <div className="flex flex-col gap-4 px-4 overflow-y-auto h-full mt-4">
            {selectedSource ? (
              <div className="flex flex-col h-full gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedSource(null);
                      setSourceContent(null);
                    }}
                  >
                    <ArrowLeft />
                  </Button>
                  <p className="font-semibold">{selectedSource.name}</p>
                </div>
                {isLoadingSource ? (
                  <div className="flex items-center h-full justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : sourceContent ? (
                  <div className="flex flex-col h-full gap-4">
                    <div className="flex flex-col gap-4  w-full rounded-lg p-4  bg-secondary">
                      <div className="flex w-full gap-2 items-center">
                        <Image
                          src="/assets/icons/stars.svg"
                          alt="stars"
                          width={24}
                          height={24}
                        />
                        <p className="font-semibold">Source guide</p>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="break-words pr-4 relative text-sm flex flex-col gap-4 col-span-2">
                          <p className="font-semibold">Summary</p>
                          <p className="font-semibold">{sourceContent.title}</p>
                          <p>{sourceContent.description}</p>
                        </div>
                        <div className="text-sm font-semibold flex flex-col gap-4">
                          <p>Key Topics</p>
                          <div className="flex flex-wrap w-full gap-2">
                            {sourceContent.keyTopics.map((topic: string) => (
                              <Button variant={"outline"} key={topic}>
                                {topic}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 break-words">
                      <p className="font-semibold">Content</p>
                      <p>{sourceContent.textContent}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                {sources.length > 0 && (
                  <div className="px-2 flex items-center w-full justify-between">
                    <p className="text-sm font-semibold">Select all</p>
                    <Checkbox
                      checked={selectedSources.length === sources.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSources(
                            sources.map(
                              (source: {
                                id: string;
                                name: string;
                                fileType: string;
                              }) => source.id
                            )
                          );
                        } else {
                          setSelectedSources([]);
                        }
                      }}
                    />
                  </div>
                )}
                {sources.map(
                  (source: {
                    id: string;
                    name: string;
                    fileType: string;
                    contentUrl: string;
                  }) => {
                    const isSourceLoading =
                      isAddingSource &&
                      source.id === sources[sources.length - 1]?.id;
                    return (
                      <Button
                        key={source.id}
                        variant={"ghost"}
                        className="flex px-2 items-center justify-between w-full"
                        onClick={() => handleSourceClick(source)}
                      >
                        <div className="flex items-center gap-2">
                          {isSourceLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            ICONS[source.fileType]
                          )}
                          <p className="text-sm">{source.name}</p>
                        </div>
                        <Checkbox
                          checked={selectedSources.includes(source.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSources((prev) => [
                                ...prev,
                                source.id,
                              ]);
                            } else {
                              setSelectedSources((prev) =>
                                prev.filter((id) => id !== source.id)
                              );
                            }
                          }}
                        />
                      </Button>
                    );
                  }
                )}
              </>
            )}
          </div>
        </div>

        <div
          className={cn(
            "col-span-2 flex flex-col h-full w-full rounded-lg border gap-4 overflow-hidden"
          )}
        >
          <div className="border-b py-2 flex justify-between items-center gap-4 px-4">
            <p className="font-semibold">Chat</p>
          </div>
          <div className="flex flex-col h-full p-4">
            {data.sources.length > 0 ? (
              <div className="flex flex-1 flex-col overflow-y-auto gap-4 pb-8">
                <div className="flex flex-col gap-4 mt-10">
                  <p className="text-4xl">{data.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {data.sources.length} sources
                  </p>
                  <p className="text-sm">{data.description}</p>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <Button variant={"outline"} className="rounded-full" disabled>
                    <Pin /> <p>Save to note</p>
                  </Button>
                  <Button variant={"ghost"} size={"icon"}>
                    <Copy />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Button variant={"outline"} className="rounded-full" disabled>
                    <Notebook />
                    <p>Add note</p>
                  </Button>

                  <Button variant={"outline"} className="rounded-full">
                    <FileAudio />
                    <p>Audio Overview</p>
                  </Button>

                  <Button variant={"outline"} className="rounded-full" disabled>
                    <Map />
                    <p>Mind map</p>
                  </Button>
                </div>
                <div className="flex flex-col gap-4 py-2">
                  {messages.map((message) => {
                    if (message.role === "user") {
                      return (
                        <UserMessageBlock key={message.id} message={message} />
                      );
                    } else {
                      return (
                        <AssistantMessageBlock
                          key={message.id}
                          message={message}
                        />
                      );
                    }
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col overflow-y-auto items-center justify-center gap-4 pb-8">
                <div className="p-4 bg-[#e5efff] rounded-full">
                  <Upload color="#4259ff" />
                </div>
                <p className="text-3xl text-center">
                  Add a source to get started
                </p>
                <Button
                  variant={"outline"}
                  className="rounded-full"
                  onClick={() => {
                    setDialogOpen(true);
                  }}
                >
                  Upload a source
                </Button>
              </div>
            )}
            <div className="relative flex w-full h-[15%]">
              <Button
                size={"icon"}
                className="absolute rounded-full right-2 top-8 -translate-y-1/2"
                disabled={data.sources.length === 0}
                onClick={() =>
                  handleSubmit(
                    {},
                    {
                      body: {
                        notebookId: id,
                        sources: selectedSources.join(","),
                        query: input,
                      },
                    }
                  )
                }
              >
                <Send />
              </Button>
              <Textarea
                value={input}
                onChange={handleInputChange}
                disabled={data.sources.length === 0}
                placeholder={
                  data.sources.length > 0
                    ? "Start typing..."
                    : "Add a source to get started"
                }
                className="h-full"
              />
            </div>
          </div>
        </div>
        <div className="col-span-2 flex flex-col h-full w-full rounded-lg border gap-4 overflow-hidden">
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
            {data.audio ? (
              <div className="flex flex-col gap-1.5">
                <p className="font-semibold">{data.title}</p>
                <div>
                  <audio
                    src={data.audio.audioUrl}
                    controls
                    className="w-full"
                  />
                </div>
              </div>
            ) : (
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
                  <Button
                    variant={"outline"}
                    className="w-full rounded-full"
                    disabled={data.sources.length === 0}
                  >
                    Customize
                  </Button>
                  <Button
                    variant={"default"}
                    className="w-full rounded-full"
                    disabled={
                      data.sources.length === 0 ||
                      selectedSources.length === 0 ||
                      isGeneratingAudio
                    }
                    onClick={handleGenerateAudio}
                  >
                    {isGeneratingAudio ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Generate"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
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
                disabled
              >
                <Plus />
                <p>Add note</p>
              </Button>
              <Button
                variant={"outline"}
                className="flex rounded-full items-center gap-2"
                disabled
              >
                <GraduationCap />
                <p>Study guide</p>
              </Button>
              <Button
                variant={"outline"}
                className="flex rounded-full items-center gap-2"
                disabled
              >
                <DockIcon />
                <p>Briefing Doc</p>
              </Button>
              <Button
                variant={"outline"}
                className="flex rounded-full items-center gap-2"
                disabled
              >
                <TableOfContents />
                <p>FAQ</p>
              </Button>
              <Button
                variant={"outline"}
                className="flex rounded-full items-center gap-2"
                disabled
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
    </div>
  );
}
