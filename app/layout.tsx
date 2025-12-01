import type { Metadata } from "next";
// @ts-ignore: allow side-effect import of CSS without type declarations
import "./globals.css";

export const metadata: Metadata = {
  title: "Mi Portfolio",
  description: "Portfolio de Full-stack Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}