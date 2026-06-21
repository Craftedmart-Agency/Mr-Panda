import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/sonner";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--color-primary)",
            color: "var(--color-primary-foreground)",
            border: "none",
          },
        }}
      />
      <Footer />
    </>
  );
}
