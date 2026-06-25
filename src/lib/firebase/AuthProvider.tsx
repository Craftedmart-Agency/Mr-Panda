"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "./config";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const checkBan = async () => {
        try {
          const res = await fetch(`/api/users/me?firebaseUid=${firebaseUser.uid}`);
          const data = await res.json();

          if (res.ok && data.user?.isBanned) {
            await signOut(auth);
            setUser(null);
          } else {
            setUser(firebaseUser);
          }
        } catch {
          setUser(firebaseUser);
        } finally {
          setLoading(false);
        }
      };

      checkBan();
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}