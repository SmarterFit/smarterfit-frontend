import AuthGuard from "@/components/base/AuthGuard";
import { SidebarProvider } from "@/components/base/nav/sidebar/SidebarContext";
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
            <SidebarProvider>
               <DashboardSidebar />
               <main className="h-screen flex">
                  <div className="p-8 flex-1">{children}</div>
               </main>
            </SidebarProvider>
         </body>
      </html>
   );
}
