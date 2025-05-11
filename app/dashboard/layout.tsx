import AuthGuard from "@/components/base/AuthGuard";
import DashboardSidebar from "@/components/pages/dashboard/DashboardSidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Dashboard",
};

export default function DashboardLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="pt-BR">
         <body className="antialiased min-h-screen flex flex-col max-w-[1920px]">
            <AuthGuard />
            <main className="h-screen flex">
               <DashboardSidebar />
               <div className="p-8 flex-1">{children}</div>
            </main>
         </body>
      </html>
   );
}
