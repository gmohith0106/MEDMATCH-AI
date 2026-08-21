import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { DemoProvider } from '@/context/DemoContext';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'MediMatch AI — Autonomous Medical Procurement & x402 Algorand Intelligence',
  description:
    'AI-powered clinical supplier intelligence and autonomous procurement settlements powered by the x402 micropayment protocol on Algorand.',
  keywords: [
    'MediMatch AI',
    'x402 protocol',
    'Algorand',
    'Medical procurement',
    'AI agent',
    'Autonomous settlements',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#050811] text-slate-100 antialiased selection:bg-[#e3577c] selection:text-white font-sans">
        <AuthProvider>
          <DemoProvider>
            <AppShell>{children}</AppShell>
          </DemoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
