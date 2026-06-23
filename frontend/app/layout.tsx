import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.scss";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

export const metadata: Metadata = {
  title: "FeedBox – Multi-Project Feedback",
  description: "Collect and manage feedback for all your projects in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-light-fb d-flex flex-column min-vh-100">

        <Navbar />

        {/* ── Page Content ── */}
        <main className="flex-grow-1">
          {children}
        </main>

        <Footer />

      </body>
    </html>
  );
}
