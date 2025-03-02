"use client"; // Required for client-side components

import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SessionProvider } from "next-auth/react"; 
import { NavBar } from "@/components/shared/NavBar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background`}>
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <NavBar />
            <div className="flex-1">{children}</div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
