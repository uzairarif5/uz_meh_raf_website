import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";

const robotoFont = Roboto();

export const metadata: Metadata = {
  title: "uzMehRaf - blog website",
  description: "This is a blog website where we dump our ideas",
};

export default function RootLayout({ children, }: Readonly<{children: React.ReactNode;}>) {
  return <html lang="en">
    <body className={robotoFont.className}>{children}</body>
  </html>
  ;
}
