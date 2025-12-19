import type { Metadata } from "next";
import { Mountains_of_Christmas, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const christmasFont = Mountains_of_Christmas({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-christmas",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const currentDate = new Date();

export const metadata: Metadata = {
  title: `Christmas Countdown ${currentDate.getFullYear()}`,
  description: "Let's Count The Days Left Before Christmas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={christmasFont.variable}>
      <body>{children}</body>
    </html>
  );
}
