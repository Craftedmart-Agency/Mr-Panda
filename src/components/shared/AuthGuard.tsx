"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/AuthProvider";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({
  children,
  requireAdmin = false,
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [adminAuthorized, setAdminAuthorized] = useState<boolean | null>(
    requireAdmin ? null : true
  );

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!requireAdmin) {
      return;
    }

    // Admin route role check
    fetch(`/api/users/me?firebaseUid=${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.role === "ADMIN") {
          setAdminAuthorized(true);
        } else {
          router.replace("/account");
        }
      })
      .catch(() => router.replace("/"));
  }, [user, loading, requireAdmin, router]);

  // Loading / checking
  if (loading || (requireAdmin && adminAuthorized === null)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
