
'use client';
import { Inter, MedievalSharp } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Image from 'next/image';
import { FirebaseClientProvider } from '@/firebase';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const medievalsharp = MedievalSharp({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-medievalsharp',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${medievalsharp.variable}`} suppressHydrationWarning>
      <head>
        <title>LuminLink</title>
        <meta name="description" content="All my links in one place." />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <FirebaseClientProvider>
          <div className="fixed inset-0 z-[-2]">
            <Image
              src="https://i.imgur.com/NBReecb.png"
              alt="Mystical background"
              fill
              className="object-cover"
              quality={90}
              priority
            />
          </div>
          <div className="fixed inset-0 bg-black/65 z-[-1]" />

          <div className="relative z-10">
            {children}
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
