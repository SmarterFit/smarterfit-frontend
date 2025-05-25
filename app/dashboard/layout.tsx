import DashboardHeader from "@/components/headers/DashboardHeader";

export default function DashboardLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <div>
         <DashboardHeader />
         <main className="flex flex-col items-center justify-center mt-16 p-4">
            {children}
         </main>
      </div>
   );
}
