import type { MetadataRoute } from "next";

const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"],
      },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/admin"],
      })),
    ],
    sitemap: "https://reactmelbourne.com/sitemap.xml",
    host: "https://reactmelbourne.com",
  };
}
