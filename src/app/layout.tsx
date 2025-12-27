import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ConditionalLayout } from '@/components/layout';
import { siteConfig } from '@/config/site';
import './globals.css';

const satoshi = localFont({
  src: [
    {
      path: '../fonts/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['athlétisme', 'javelot', 'Timothy Montavon', 'athlète', 'lancer', 'sport'],
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adminSecret = process.env.ADMIN_URL_SECRET || 'admin';

  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${satoshi.variable} antialiased`}>
        <ConditionalLayout adminSecret={adminSecret}>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
