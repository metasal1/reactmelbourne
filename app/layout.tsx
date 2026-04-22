import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "React Melbourne — JavaScript meetup for devs building real things",
    template: "%s · React Melbourne",
  },
  description:
    "Melbourne's React community. 6,070 members. Quarterly meetups covering React, React Native, performance, architecture, and the hard-won lessons in between.",
  metadataBase: new URL("https://reactmelbourne.com"),
  applicationName: "React Melbourne",
  keywords: [
    "React Melbourne",
    "React meetup Melbourne",
    "React Australia",
    "JavaScript meetup Melbourne",
    "React Native Melbourne",
    "frontend meetup Melbourne",
    "TypeScript meetup",
    "Naarm tech",
    "Melbourne developers",
  ],
  authors: [{ name: "React Melbourne" }],
  creator: "React Melbourne",
  publisher: "React Melbourne",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "React Melbourne — JavaScript meetup for devs building real things",
    description:
      "A meetup for people building with React, React Native, and the sprawling JavaScript universe around them.",
    url: "https://reactmelbourne.com",
    siteName: "React Melbourne",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "React Melbourne",
    description: "JavaScript meetup for devs building real things.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
