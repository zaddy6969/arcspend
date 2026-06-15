import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";

import "@/app/globals.css";
import { AppStateProvider } from "@/components/providers/app-state-provider";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Sora({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "ArcSpend",
  description: "Track every USDC move on Arc, clearly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}

