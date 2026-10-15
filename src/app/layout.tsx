import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// Link previews need absolute URLs: production uses the real domain, Vercel
// previews their own URL, local dev localhost
const siteUrl =
  process.env.VERCEL_ENV === 'production'
    ? 'https://www.thatday.space'
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT ?? 3000}`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ThatDay — Your Personal Time Capsule",
  description: "Step back in time. Discover what happened on the day you were born — the songs, events, famous birthdays, and what things cost.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "ThatDay — Your Personal Time Capsule",
    description: "Step back in time. Discover what happened on the day you were born — the songs, events, famous birthdays, and what things cost.",
    images: [{ url: '/social-preview.png', width: 1200, height: 630, alt: 'ThatDay: Every day leaves a mark.' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ThatDay — Your Personal Time Capsule",
    description: "Step back in time. Discover what happened on the day you were born — the songs, events, famous birthdays, and what things cost.",
    images: ['/social-preview.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('td-splash-seen')==='1'){var d=document.documentElement.dataset;d.splash='seen';d.returning='1'}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
