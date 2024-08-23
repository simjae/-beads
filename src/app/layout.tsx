"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../src/styles/globals.css";
import MetaTags from "@src/components/Seo/MetaTags";
import { DM_Sans } from "next/font/google";
import { Space_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "픽셀 아트",
//   description: "픽셀 아트를 만들어보세요",
// };

const fontHeading = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});
const fontBody = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <MetaTags
        title="홈페이지 제목"
        description="홈페이지 설명"
        keywords="비즈 도안, 픽셀 아트, DIY"
        author="YourName"
        image="https://yoursitename.com/og-image.jpg"
        url="https://yoursitename.com"
      />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
