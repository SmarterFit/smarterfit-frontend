import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/base/header/Header";
import { NotificationsProvider } from "@/components/base/notifications/NotificationsContext";
import Footer from "@/components/base/footer/Footer";

export const metadata: Metadata = {
   title: "SmarterFit",
   description: "Aplicação de controle da academia SmarterFit",
   authors: [
      { name: "Gabriel Henrique" },
      { name: "Gabriel Silva" },
      { name: "Pedro Lucas" },
   ],
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="pt-BR">
         <body className="antialiased min-h-screen flex flex-col max-w-[1920px]">
            <NotificationsProvider>
               <Header />
               {children}
               <Footer/>
            </NotificationsProvider>
         </body>
      </html>
   );
}
