import AccountSidebar from "./_components/AccountSidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-secondary/20 pt-16">
      <div className="mx-auto flex max-w-7xl">
        <AccountSidebar />
        {/* Content — mobile e niche bottom tab er jonno pb-24 */}
        <main className="min-h-[calc(100vh-64px)] flex-1 p-4 pb-28 sm:p-6 sm:pb-28 lg:p-8 lg:pb-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}