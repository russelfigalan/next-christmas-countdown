import type { Metadata } from "next";
import { Mountains_of_Christmas } from "next/font/google";
import { PageLoaderProvider } from "./components/PageLoaderProvider";
import PageLoader from "./components/PageLoader";
import "./globals.css";

const christmasFont = Mountains_of_Christmas({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-christmas",
  display: "swap",
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
      <body>
        <PageLoaderProvider>
          <PageLoader />
          {children}
        </PageLoaderProvider>
      </body>
    </html>
  );
}
