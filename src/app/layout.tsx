import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://one9founders.com'),
  title: {
    default: 'One9Founders - AI Tool Directory for Startups',
    template: '%s | One9Founders',
  },
  description: 'Discover AI tools for founders and startups through intelligent semantic search. Find the best AI solutions to accelerate your business growth.',
  keywords: ['AI tools', 'startup tools', 'founder resources', 'AI directory', 'semantic search', 'business tools'],
  authors: [{ name: 'One9Founders' }],
  creator: 'One9Founders',
  publisher: 'One9Founders',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://one9founders.com',
    siteName: 'One9Founders',
    title: 'One9Founders - AI Tool Directory for Startups',
    description: 'Discover AI tools for founders and startups through intelligent semantic search',
    images: [{
      url: '/android-chrome-512x512.png',
      width: 512,
      height: 512,
      alt: 'One9Founders',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'One9Founders - AI Tool Directory for Startups',
    description: 'Discover AI tools for founders and startups through intelligent semantic search',
    images: ['/android-chrome-512x512.png'],
    creator: '@one9founders',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href="https://one9founders.com" />
        <script src="https://t.contentsquare.net/uxa/d11fb4e793d48.js"></script>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-455BX3CJP8"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-455BX3CJP8');
          `
        }} />
      </head>
      <body
        className={`${inter.variable} ${bricolageGrotesque.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
