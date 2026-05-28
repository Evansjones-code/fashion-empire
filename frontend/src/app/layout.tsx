import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EMPIRE FASHION", 
  description: "High-performance luxury apparel storefront",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ backgroundColor: "#F5F4F0" }}
    >
      <body 
        className="min-h-full flex flex-col"
        style={{ backgroundColor: "#F5F4F0", margin: 0, padding: 0 }}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
