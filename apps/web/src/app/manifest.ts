import type { MetadataRoute } from "next";

/**
 * Srcfull Web App Manifest
 *
 * Defines PWA properties including name, colors, and icons.
 * The theme color matches the dark background for seamless browser chrome.
 *
 * To use: rename to manifest.ts
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Srcfull",
    short_name: "Srcfull",
    description: "Resolve image URLs to their highest-quality source versions",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#0a0a0f",
    icons: [
      {
        src: "/icon?size=192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon?size=512",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
