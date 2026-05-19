import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Казковий Край',
  description: 'Щоденні казки для дітей, згенеровані за допомогою AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
