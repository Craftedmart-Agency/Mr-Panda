import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "./config";

// Neon database e user sync
async function syncUserToDb(user: User, name?: string) {
  await fetch("/api/users/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firebaseUid: user.uid,
      email: user.email,
      name: name || user.displayName,
      image: user.photoURL,
    }),
  });
}

// Register
export async function registerWithEmail(
  name: string,
  email: string,
  password: string
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await updateProfile(userCredential.user, { displayName: name });

  // Neon e sync
  await syncUserToDb(userCredential.user, name);

  return userCredential.user;
}

// Login
export async function loginWithEmail(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}

// Google login
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);

  // Neon e sync (Google user notun hote pare)
  await syncUserToDb(result.user);

  return result.user;
}

// Logout
export async function logout() {
  await firebaseSignOut(auth);
}