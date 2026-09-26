import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

import { auth } from "@/lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  return {
    user,
    loading,
    isAuthenticated: user !== null,
  };
}
