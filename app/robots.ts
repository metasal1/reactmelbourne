import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://reactmelbourne.com/sitemap.xml",
    host: "https://reactmelbourne.com",
  };
}
