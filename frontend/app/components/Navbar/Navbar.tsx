"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { removeAuthCookie } from "@/utils/authCookies";
import toast from "react-hot-toast";

export default function Navbar() {
  const router    = useRouter();
  const [user,       setUser]       = useState<User | null>(null);
  const [menuOpen,   setMenuOpen]   = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLogout = async () => {
    await signOut(auth);
    removeAuthCookie();
    toast.success("Logged out successfully.", { id: "auth-toast" });
    router.push("/login");
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <nav className="fb-navbar sticky-top">
      <div className="container">
        <div className="fb-navbar-inner">

          <a href="/" className="fb-brand">Feed<span>Box</span></a>

          {/* Desktop links */}
          <div className="fb-nav-links">
            {user && user.emailVerified && (
              <>
                <a href="/"          className="fb-nav-link">Projects</a>
                <a href="/dashboard" className="fb-nav-link">Dashboard</a>
                <a href="/feedback"  className="fb-btn fb-btn-primary fb-btn-sm">+ New Feedback</a>
              </>
            )}
            {user ? (
              <button onClick={handleLogout} className="fb-btn fb-btn-ghost fb-btn-sm">Logout</button>
            ) : (
              <a href="/login" className="fb-btn fb-btn-outline fb-btn-sm">Login</a>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`fb-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>

        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fb-mobile-menu">
          {user && user.emailVerified && (
            <>
              <a href="/"          className="fb-mobile-link" onClick={close}>Projects</a>
              <a href="/dashboard" className="fb-mobile-link" onClick={close}>Dashboard</a>
              <a href="/feedback"  className="fb-mobile-link" onClick={close}>+ New Feedback</a>
            </>
          )}
          {user ? (
            <button onClick={handleLogout} className="fb-mobile-link fb-mobile-logout">Logout</button>
          ) : (
            <a href="/login" className="fb-mobile-link" onClick={close}>Login</a>
          )}
        </div>
      )}
    </nav>
  );
}
