import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Казковий Край',
  description: 'Казки для всіх. Казки іспанською. Казки англійською. Різні казки.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
