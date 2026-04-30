import type { Metadata } from 'next';
import { Google_Sans_Flex, Quicksand, Instrument_Sans } from 'next/font/google';
import './globals.css';
const googleSans = Google_Sans_Flex({
  variable: '--font-google-sans-flex',
  subsets: ['latin'],
});

const quicksand = Quicksand({
  variable: '--font-quicksand',
  subsets: ['latin'],
});

const instrumentSans = Instrument_Sans({
  variable: '--font-instrument-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Chatter',
  description: 'Simple chat app build with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${googleSans.variable} ${quicksand.variable} ${instrumentSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
