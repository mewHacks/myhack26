import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const pressStart2P = localFont({
  src: "../fonts/Press_Start_2P/PressStart2P-Regular.ttf",
  variable: "--font-press-start-2p",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Covalent",
  description: "Pages for startups, investors, and mentors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${pressStart2P.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
