import AdminSidebar from "./_components/AdmineSidebar";
import AdminHeader from "./_components/AdminHeader";
import AuthGuard from "@/components/shared/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAdmin>
      <div className="flex min-h-screen bg-secondary/20">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main area */}
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 p-4 pb-28 sm:p-6 lg:p-8 lg:pb-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}