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
  metadataBase: new URL("https://arcspend.vercel.app"),
  title: {
    default: "ArcSpend",
    template: "%s | ArcSpend",
  },
  description: "Track. Analyze. Optimize. Powered by AI.",
  applicationName: "ArcSpend",
  keywords: [
    "ArcSpend",
    "crypto expense tracking",
    "wallet analytics",
    "fintech dashboard",
    "ai finance ui",
    "arc wallet",
  ],
  openGraph: {
    title: "ArcSpend",
    description: "Track. Analyze. Optimize. Powered by AI.",
    url: "https://arcspend.vercel.app",
    siteName: "ArcSpend",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArcSpend",
    description: "Track. Analyze. Optimize. Powered by AI.",
  },
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
