"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../src/styles/globals.css";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
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
      <body className={inter.className}>
        <Router>{children}</Router>
      </body>
    </html>
  );
}
