import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CycleCare - Menstrual Health Tracker",
  description: "Secure and intelligent menstrual health tracking platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="layout-wrapper">
            <Navbar />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
        <style dangerouslySetInnerHTML={{ __html: `
          .layout-wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
          .main-content {
            flex: 1;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
          }
        `}} />
      </body>
    </html>
  );
}

