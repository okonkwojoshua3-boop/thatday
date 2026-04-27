import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ThatDay — Your Personal Time Capsule",
  description: "Step back in time. Discover what happened on the day you were born — the songs, events, famous birthdays, and what things cost.",
  icons: {
    icon: '/ThatDay Favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "ThatDay — Your Personal Time Capsule",
    description: "Step back in time. Discover what happened on the day you were born — the songs, events, famous birthdays, and what things cost.",
    images: [{ url: '/ThatDay Social Preview.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ThatDay — Your Personal Time Capsule",
    description: "Step back in time. Discover what happened on the day you were born — the songs, events, famous birthdays, and what things cost.",
    images: ['/ThatDay Social Preview.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
