import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrainLog — GitHub for your mind",
  description:
    "Track every book, article, podcast, and paper you consume. Build your intellectual fingerprint.",
  keywords: ["reading tracker", "media log", "intellectual profile", "books", "articles"],
  openGraph: {
    title: "BrainLog",
    description: "GitHub for your mind.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
