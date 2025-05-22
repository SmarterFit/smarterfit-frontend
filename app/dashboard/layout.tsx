import DashboardHeader from "@/components/headers/DashboardHeader";

export default function DashboardLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <div>
         <DashboardHeader />
         <main className="flex flex-col items-center justify-center pt-16">
            {children}
         </main>
      </div>
   );
}
