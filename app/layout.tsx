import type { Metadata } from "next";
import { Bebas_Neue, Bodoni_Moda } from "next/font/google";
import Link from "next/link";
import { Home, Database, Activity } from "lucide-react";
import Dock from "@/components/ui/Dock";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const bodoniModa = Bodoni_Moda({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bodoni",
});

export const metadata: Metadata = {
  title: "Fathoming Melodies",
  description: "Machine Learning Frontend Display",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${bodoniModa.variable} h-full antialiased`}>
      <body className={`${bebasNeue.variable} ${bodoniModa.variable} min-h-full flex flex-col font-bodoni`}>
        {children}
        <Dock>
          <Link href="/">
            <Home className="text-white/50 hover:text-white transition-colors" />
          </Link>
          <Link href="/dataset">
            <Database className="text-white/50 hover:text-white transition-colors" />
          </Link>
          <Link href="/outputs">
            <Activity className="text-white/50 hover:text-white transition-colors" />
          </Link>
        </Dock>
      </body>
    </html>
  );
}
