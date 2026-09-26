import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

export async function register(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return credential.user;
}

export async function login(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  return credential.user;
}

export async function logout() {
  await signOut(auth);
}
