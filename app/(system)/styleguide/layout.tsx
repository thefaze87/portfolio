import type { Metadata } from 'next';

/**
 * The styleguide is an internal design-system reference, not a public route.
 * It must never be indexed: it leaks unreleased component variants, breaks
 * the editorial illusion, and burns crawl budget on a non-content page.
 */
export const metadata: Metadata = {
  title: 'Styleguide',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function StyleguideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
