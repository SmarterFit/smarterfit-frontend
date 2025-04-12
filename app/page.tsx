import Input from "@/components/form/Input";
import InfoCard from "@/components/InfoCard";
import Link from "@/components/Link";
import { Calendar, ChartNoAxesCombined, Check } from "lucide-react";

export default function Home() {
   return (
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
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-24">
            <InfoCard
               icon={<Check width={75} height={75} />}
               title="Track Progress"
               description="Lorem ipsum dolor sit, amet consectetur adipisicing elit."
            />
            <InfoCard
               icon={<Calendar width={75} height={75} />}
               title="Track Progress"
               description="Lorem ipsum dolor sit, amet consectetur adipisicing elit."
            />
            <InfoCard
               icon={<ChartNoAxesCombined width={75} height={75} />}
               title="Track Progress"
               description="Lorem ipsum dolor sit, amet consectetur adipisicing elit."
               className="sm:col-span-2 md:col-span-1"
            />
         </div>
      </main>
   );
}
