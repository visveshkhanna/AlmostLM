export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden">
      <div className="flex h-screen max-h-dvh">
        <main className="h-[100dvh] flex-1 overflow-x-hidden">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
