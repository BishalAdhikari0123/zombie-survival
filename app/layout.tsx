import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zombie Survival Game",
  description: "Fast-paced 2D zombie survival game built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
