"use client";
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Select } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import {
  ArrowUpDown,
  Check,
  Grid2X2,
  Menu,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import NotebookCard from "./notebook-card";
import { useQuery } from "@tanstack/react-query";
import { Notebook } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FILTERS = ["Most Recent", "Title"];

const getColumns = (
  navigateToNotebook: (id: string) => void
): ColumnDef<Notebook>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title") || "Untitled"}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      // Format as Day Month Year (e.g., 25 Jun 2023)
      return (
        <div>
          {date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "_count.sources",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sources
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // Access the sources count, handle cases where _count might not be available
      const notebook = row.original;
      const sourcesCount = notebook._count?.sources || 0;
      return <div className="text-center">{sourcesCount}</div>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: () => <div className="text-muted-foreground">Owner</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const notebook = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigateToNotebook(notebook.id)}>
              Open notebook
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function NotebooksListView({ data }: { data: Notebook[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const router = useRouter();

  const navigateToNotebook = (id: string) => {
    router.push(`/notebook/${id}`);
  };

  const table = useReactTable({
    data,
    columns: getColumns(navigateToNotebook),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      globalFilter: searchFilter,
    },
    onGlobalFilterChange: setSearchFilter,
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search notebooks..."
          value={searchFilter}
          onChange={(event) => setSearchFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => navigateToNotebook(row.original.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={getColumns(navigateToNotebook).length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function NotebooksList() {
  const [filter, setFilter] = useState("0");
  const [view, setView] = useState("grid");

  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["notebooks"],
    queryFn: async () => {
      const res = await fetch("/api/notebooks/getNotebooks");
      return res.json();
    },
  });

  const handleCreateNotebook = async () => {
    try {
      const res = await fetch("/api/notebooks/createNotebook", {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to create notebook");
      }

      const data = await res.json();
      router.push(`/notebook/${data.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center w-full gap-4">
        <Button
          className="hidden md:flex rounded-full items-center gap-2"
          onClick={handleCreateNotebook}
        >
          <Plus />
          <p>Create new</p>
        </Button>
        <div className="justify-between w-full lg:w-fit lg:justify-start flex items-center gap-2 cursor-pointer">
          <div className="flex gap-2 items-center relative overflow-hidden border rounded-full">
            <div
              className={cn(
                "p-3 overflow-hidden  flex items-center gap-2 transition-all duration-300 ease-in-out z-10",
                {
                  "bg-secondary": view === "grid",
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
                  "bg-secondary": view === "list",
                }
              )}
              onClick={() => setView("list")}
            >
              {view === "list" && (
                <Check className="animate-in fade-in duration-300" />
              )}
              <Menu />
            </div>
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

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-4">
          {data.length === 0 && (
            <div className="col-span-4 flex justify-center items-center">
              <p>No notebooks found</p>
            </div>
          )}
          {data.map((notebook: Notebook, i: number) => (
            <NotebookCard key={i} notebook={notebook} />
          ))}
        </div>
      ) : (
        <NotebooksListView data={data} />
      )}
    </div>
  );
}
