"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./firebase/AuthProvider";

interface ProfileContextType {
  profileImage: string;
  setProfileImage: (image: string) => void;
  refreshProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string>("");

  const refreshProfile = async () => {
    if (user) {
      try {
        const res = await fetch(`/api/users/profile?firebaseUid=${user.uid}`);
        const data = await res.json();
        if (data.user?.image) {
          setProfileImage(data.user.image);
        }
      } catch {
        // Silent error
      }
    }
  };

  // Load profile image on user change
  useEffect(() => {
    refreshProfile();
  }, [user]);

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
}
