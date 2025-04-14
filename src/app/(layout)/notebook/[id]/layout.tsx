import Navbar from "../components/navbar";

export default function NotebookLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <div className="flex flex-col h-full w-full">
      <Navbar id={params.id} />
      {children}
    </div>
  );
}
