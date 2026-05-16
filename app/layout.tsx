import type { Metadata } from "next";
import Head from 'next/head';

export const metadata: Metadata = {
  title: "uzMehRaf - blog website",
  description: "This is a blog website where we dump our ideas",
};

export default function RootLayout({ children, }: Readonly<{children: React.ReactNode;}>) {
  return <html lang="en">
    <Head><meta name="viewport" content="width=device-width, initial-scale=1.0"/></Head>
    {children}
  </html>;
}
