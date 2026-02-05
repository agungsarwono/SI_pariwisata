import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ClientLayoutWrapper } from "@/components/layout/client-layout-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SID-Jepara - Sistem Informasi Destinasi Pariwisata",
  description: "Dashboard Manajemen Pariwisata Jepara",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <ClientLayoutWrapper>
            <Header />
            <main className="flex-1 p-6 overflow-x-hidden">
              {children}
            </main>
          </ClientLayoutWrapper>
        </div>
      </body>
    </html>
  );
}
