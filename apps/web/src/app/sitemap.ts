import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/app-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = getAppUrl();

  return [
    {
      url: appUrl,
      lastModified: new Date(),
    },
  ];
}
