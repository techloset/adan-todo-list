import type { Metadata } from "next";
import { Stint_Ultra_Condensed } from "next/font/google";

import "./globals.css";
import Toaster from "@/components/ToastContainer";

const Stint = Stint_Ultra_Condensed({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-Stint",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${Stint.variable} Black-orange-bg `}
        suppressHydrationWarning
      >
        <Toaster />
        <div className=" font-MriyaGrotesk-ExtraBold font-black">
          {children}
        </div>
      </body>
    </html>
  );
}
