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
  title: "React Melbourne — JavaScript meetup for devs building real things",
  description:
    "Melbourne's React community. 6,070 members. Quarterly meetups covering React, React Native, performance, architecture, and the hard-won lessons in between.",
  metadataBase: new URL("https://reactmelbourne.com"),
  openGraph: {
    title: "React Melbourne",
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
