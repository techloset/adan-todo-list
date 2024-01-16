import type { Metadata } from "next";
import { Stint_Ultra_Condensed, Poppins } from "next/font/google";

import "./globals.css";
import Toaster from "@/components/ToastContainer";

const Stint = Stint_Ultra_Condensed({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-Stint",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-poppins",
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
        className={`${Stint.variable} ${poppins.variable} Black-orange-bg `}
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
