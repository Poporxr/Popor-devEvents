import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";

const schibsted_Grotesk = Schibsted_Grotesk({
  variable: "--font-schibsted_Grotesk",
  subsets: ["latin"],
});

const martian_Mono = Martian_Mono({
  variable: "--font-martian_Mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Popor devEvent",
  description: "The Hub for Every Dev Event You Musn't Miss",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibsted_Grotesk.variable} min-h-screen  ${martian_Mono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
