import type { Metadata } from 'next';
import './globals.css';
import { Montserrat } from 'next/font/google';
import TrackingForm from '@/app/components/search-order-tracking';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';
import AppProvider from '@/app/AppProvider';
import { CallZaloButton } from '@/app/components/call-zalo-button';

// const robotoMono = Roboto_Mono({
//   variable: '--font-roboto-mono',
//   subsets: ['latin'],
// });

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-montserrat`}>
        <AppProvider>
          <Header />
          <main>{children}</main>
          <TrackingForm />
          <Footer />
          <CallZaloButton />
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
