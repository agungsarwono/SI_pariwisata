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

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen">
            <Sidebar />
            <ClientLayoutWrapper>
              <Header />
              <main className="flex-1 p-6 overflow-x-hidden">
                {children}
              </main>
            </ClientLayoutWrapper>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
