import Card from "@/components/Card";
import Header from "@/components/header/Header";
import Link from "@/components/Link";
import { Calendar, ChartNoAxesCombined, Check } from "lucide-react";

export default function Home() {
   return (
      <div>
         <Header />

         <main className="flex flex-col items-center mt-24 px-8 gap-8">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
               <h1 className="text-7xl font-bold">Bem-vindo ao SmarterFit</h1>
               <p className="text-3xl">Gerencie seus treinos com facilidade</p>
               <Link
                  variant="secondary"
                  className="text-3xl px-6 py-3 rounded-lg text-white"
               >
                  Começar
               </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-24 max-w-4xl">
               <Card>
                  <Check width={75} height={75} className="text-accent" />
                  <h2 className="text-2xl font-bold">Track Progress</h2>
                  <p className="text-xl">
                     Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  </p>
               </Card>
               <Card>
                  <Calendar width={75} height={75} className="text-accent" />
                  <h2 className="text-2xl font-bold">Track Progress</h2>
                  <p className="text-xl">
                     Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  </p>
               </Card>
               <Card className="sm:col-span-2 md:col-span-1">
                  <ChartNoAxesCombined
                     width={75}
                     height={75}
                     className="text-accent"
                  />
                  <h2 className="text-2xl font-bold">Track Progress</h2>
                  <p className="text-xl">
                     Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  </p>
               </Card>
            </div>
         </main>
      </div>
   );
}
