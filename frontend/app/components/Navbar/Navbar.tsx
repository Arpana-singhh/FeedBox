"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { removeAuthCookie } from "@/utils/authCookies";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Listen to Firebase auth state — updates instantly on login/logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    removeAuthCookie();
    toast.success("Logged out successfully.", { id: "auth-toast" });
    router.push("/login");
  };

  return (
    <nav className="fb-navbar sticky-top">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">

          <a href="/" className="fb-brand">Feed<span>Box</span></a>

          <div className="d-flex align-items-center gap-3">
            {user && user.emailVerified && (
              <>
                <a href="/"          className="fb-nav-link">Projects</a>
                <a href="/dashboard" className="fb-nav-link">Dashboard</a>
                <a href="/feedback"  className="fb-btn fb-btn-primary fb-btn-sm">
                  + New Feedback
                </a>
              </>
            )}

            {/* Show Login or Logout based on auth state */}
            {user ? (
              <button onClick={handleLogout} className="fb-btn fb-btn-ghost fb-btn-sm">
                Logout
              </button>
            ) : (
              <a href="/login" className="fb-btn fb-btn-outline fb-btn-sm">
                Login
              </a>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
}
