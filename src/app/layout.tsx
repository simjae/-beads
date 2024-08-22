"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../src/styles/globals.css";
import MetaTags from "@src/components/Seo/MetaTags";
const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "픽셀 아트",
//   description: "픽셀 아트를 만들어보세요",
// };

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
