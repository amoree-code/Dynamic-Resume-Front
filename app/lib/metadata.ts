import type { Metadata, Viewport } from 'next';

export const SITE_NAME = 'Ameer Abdulkareem';

export const baseMetadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: `Personal portfolio of ${SITE_NAME} — software developer.`,
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary',
  },
};

export const baseViewport: Viewport = {
  themeColor: '#0a0a0a',
};
