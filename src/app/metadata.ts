import { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Shortener",
  description: "A modern URL shortening service",
  keywords: ["url shortener", "link shortener", "url analytics", "short links"],
  authors: [{ name: "URL Shortener Team" }],
  creator: "URL Shortener",
  publisher: "URL Shortener",
  robots: "index, follow",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  icons: {
    icon: "/favicon.ico",
  },
}; 