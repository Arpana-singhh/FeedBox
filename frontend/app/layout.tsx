import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.scss";

export const metadata: Metadata = {
  title: "FeedBox – Multi-Project Feedback",
  description: "Collect and manage feedback for all your projects in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-light-fb d-flex flex-column min-vh-100">

        {/* ── Navbar ── */}
        <nav className="fb-navbar sticky-top">
          <div className="container">
            <div className="d-flex align-items-center justify-content-between">

              <a href="/" className="fb-brand">Feed<span>Box</span></a>

              <div className="d-flex align-items-center gap-3">
                <a href="/"          className="fb-nav-link">Projects</a>
                <a href="/dashboard" className="fb-nav-link">Dashboard</a>
                <a href="/feedback"  className="fb-btn fb-btn-primary fb-btn-sm">
                  + New Feedback
                </a>
              </div>

            </div>
          </div>
        </nav>

        {/* ── Page Content ── */}
        <main className="flex-grow-1">
          {children}
        </main>

        {/* ── Footer ── */}
        <footer className="fb-footer">
          <div className="container d-flex align-items-center justify-content-between">
            <span className="fb-brand" style={{ fontSize: "0.95rem" }}>Feed<span>Box</span></span>
            <span>Built with Firebase + Next.js &mdash; Learning Project</span>
          </div>
        </footer>

      </body>
    </html>
  );
}
