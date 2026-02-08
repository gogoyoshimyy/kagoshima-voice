import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Changed from Geist to Inter for better compatibility/style
import "./globals.css";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kagoshima Voice - 荒れない市民の声プラットフォーム",
  description: "鹿児島の困りごとを前向きに解決するプラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${inter.className} antialiased min-h-screen bg-slate-50 text-slate-900`}
      >
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
