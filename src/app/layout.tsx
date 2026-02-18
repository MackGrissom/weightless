import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Weightless — Remote Jobs for Digital Nomads",
    template: "%s | Weightless",
  },
  description:
    "The job board built for digital nomads. Find remote work with cost-of-living context, visa sponsorship info, and timezone filtering. Free for job seekers.",
  keywords: [
    "remote jobs",
    "digital nomad jobs",
    "work from anywhere",
    "remote work",
    "location independent",
    "digital nomad",
    "remote developer jobs",
    "remote design jobs",
    "visa sponsorship remote",
    "async remote work",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Weightless",
    title: "Weightless — Remote Jobs for Digital Nomads",
    description:
      "Find remote work with salary-in-context, visa info, and timezone filtering. Built for the location-independent workforce.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weightless — Remote Jobs for Digital Nomads",
    description:
      "Find remote work with salary-in-context, visa info, and timezone filtering.",
  },
  alternates: {
    canonical: siteUrl,
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
