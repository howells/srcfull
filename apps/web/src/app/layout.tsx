import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css"; // Change to globals-srcfull.css when ready
import { ErrorBoundary } from "@/components/error-boundary";
import { getAppUrl } from "@/lib/app-url";

const baseUrl = getAppUrl();

/**
 * Typography Stack for Srcfull
 *
 * - Inter: Body text, UI elements
 * - Space Grotesk: Headlines, display text
 * - JetBrains Mono: Code samples, API references
 */

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Srcfull - Find the source",
    template: "%s | Srcfull",
  },
  description:
    "Resolve image URLs to their highest-quality source versions. A paid API built for production pipelines where quality matters.",
  keywords: [
    "image API",
    "image resolution",
    "source finder",
    "high quality images",
    "CDN resolver",
    "image transformation",
    "developer API",
  ],
  authors: [{ name: "Srcfull" }],
  creator: "Srcfull",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Srcfull",
    title: "Srcfull - Find the source. Every time.",
    description:
      "Resolve image URLs to their highest-quality source versions.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Srcfull - Find the source. Every time.",
    description:
      "Resolve image URLs to their highest-quality source versions.",
    creator: "@srcfull",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      lang="en"
    >
      <body className="antialiased">
        <ClerkProvider
          appearance={{
            variables: {
              // Srcfull brand colors for Clerk components
              colorPrimary: "#00d4ff",
              colorBackground: "#12121a",
              colorInputBackground: "#1a1a24",
              colorInputText: "#fafafa",
              colorText: "#fafafa",
              colorTextSecondary: "#94a3b8",
              colorDanger: "#ef4444",
              colorSuccess: "#10b981",
              borderRadius: "8px",
            },
            elements: {
              // Dark theme overrides
              card: {
                backgroundColor: "#12121a",
                borderColor: "rgba(255, 255, 255, 0.06)",
              },
              headerTitle: {
                color: "#fafafa",
              },
              headerSubtitle: {
                color: "#94a3b8",
              },
              formButtonPrimary: {
                backgroundColor: "#00d4ff",
                color: "#0a0a0f",
                "&:hover": {
                  backgroundColor: "#5ce5ff",
                },
              },
              footerActionLink: {
                color: "#00d4ff",
                "&:hover": {
                  color: "#5ce5ff",
                },
              },
            },
          }}
        >
          <ErrorBoundary>{children}</ErrorBoundary>
        </ClerkProvider>
      </body>
    </html>
  );
}
