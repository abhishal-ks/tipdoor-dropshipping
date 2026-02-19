import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TipDoor - Drop Shipping Store",
  description: "Your desired products, delivered to your doorstep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}

function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}