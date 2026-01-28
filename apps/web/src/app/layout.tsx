import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/error-boundary";
import { getAppUrl } from "@/lib/app-url";

const baseUrl = getAppUrl();

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Beeline",
    template: "%s | Beeline",
  },
  description:
    "Paid API that resolves image URLs to their highest-quality source versions.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Beeline",
    title: "Beeline",
    description: "Resolve image URLs to their highest-quality source versions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beeline",
    description: "Resolve image URLs to their highest-quality source versions.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${dmSans.variable} ${instrumentSerif.variable}`}
      lang="en"
    >
      <body className="antialiased">
        <ClerkProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ClerkProvider>
      </body>
    </html>
  );
}
