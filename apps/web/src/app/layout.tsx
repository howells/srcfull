import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/error-boundary";
import { getAppUrl } from "@/lib/app-url";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const baseUrl = getAppUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Srcfull - Every image, any URL",
    template: "%s | Srcfull",
  },
  description:
    "Extract every image from any webpage at its highest resolution. One API call.",
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
    title: "Srcfull - Every image, any URL",
    description:
      "Extract every image from any webpage at its highest resolution.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Srcfull - Every image, any URL",
    description:
      "Extract every image from any webpage at its highest resolution.",
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
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#171717",
              colorBackground: "#ffffff",
              colorInputBackground: "#fafafa",
              colorInputText: "#171717",
              colorText: "#171717",
              colorTextSecondary: "#525252",
              colorDanger: "#dc2626",
              colorSuccess: "#16a34a",
              borderRadius: "6px",
            },
            elements: {
              card: {
                backgroundColor: "#ffffff",
                borderColor: "#e5e5e5",
              },
              headerTitle: {
                color: "#171717",
              },
              headerSubtitle: {
                color: "#525252",
              },
              formButtonPrimary: {
                backgroundColor: "#171717",
                color: "#ffffff",
                "&:hover": {
                  opacity: 0.85,
                },
              },
              footerActionLink: {
                color: "#171717",
                "&:hover": {
                  opacity: 0.7,
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
