import type { Metadata } from "next";
import { Geist, Geist_Mono, Merienda } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

const merienda = Merienda({
  variable: "--font-merienda",
  subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "LÚMINA",
   description: "A smarter fitness app",
   authors: [
      { name: "Gabriel Henrique" },
      { name: "Gabriel Victor" },
      { name: "Pedro Lucas" },
   ],
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="pt-br">
         <body
            className={`${geistSans.variable} ${geistMono.variable} ${merienda.variable} antialiased min-h-screen flex flex-col`}
         >
            {children}
            <Toaster />
         </body>
      </html>
   );
}
