import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nodlearn | Premium Financial Education",
  description: "Learn how modern investments work with our free financial education covering stocks, blockchain, and real estate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <NextAuthProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </NextAuthProvider>
      </body>
    </html>
  );
}
