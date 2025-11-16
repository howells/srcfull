import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beeline - AI Image Extractor",
  description: "Extract clean, full-resolution images from any web page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
