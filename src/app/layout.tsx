import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/lib/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "AlmostLM | Note Taking & Research Assistant Powered by AI",
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  openGraph: {
    images: [
      `${process.env.NEXT_PUBLIC_HOST}/assets/images/opengraph-image.jpg`,
    ],
  },
  title: "AlmostLM | Note Taking & Research Assistant Powered by AI",
  description:
    "Use the power of AI for quick summarization and note taking, AlmostLM is your powerful virtual research assistant rooted in information you can trust.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
