import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.scss";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import { AntdRegistry } from "@ant-design/nextjs-registry";

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
        {/* AntdRegistry injects antd styles server-side — fixes the CSS flash on first load */}
        <AntdRegistry>
          <main className="flex-grow-1">
            {children}
          </main>
        </AntdRegistry>

        <Footer />

        {/* Global toast notifications — available on every page */}
        <Toaster position="bottom-right" toastOptions={{ duration: 6000 }} />

      </body>
    </html>
  );
}
