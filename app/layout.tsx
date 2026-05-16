import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "uzMehRaf - blog website",
  description: "This is a blog website where we dump our ideas",
};

export default function RootLayout({ children, }: Readonly<{children: React.ReactNode;}>) {
  return <html lang="en">{children}</html>;
}
