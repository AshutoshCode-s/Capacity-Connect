import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Capacity Connect',
  description: 'Skills and training management platform',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
