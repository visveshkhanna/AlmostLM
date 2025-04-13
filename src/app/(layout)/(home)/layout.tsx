import NavbarHome from "@/components/navbar-home";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <NavbarHome />
      <div className="flex-1">{children}</div>
    </div>
  );
}
