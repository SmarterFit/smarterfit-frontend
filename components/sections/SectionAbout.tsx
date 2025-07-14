"use client";

import Image from "next/image";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
   CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, HeartPulse, ChartLine } from "lucide-react";

export default function SectionAbout() {
   return (
      <section
         className="w-full bg-cover bg-center py-20 min-h-screen pt-16"
         id="sobre"
      >
         <div className="container mx-auto relative z-20 flex flex-col items-center justify-center text-center min-h-screen p-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center">
               Sobre a LÚMINA
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-lg md:text-xl">
               Na LÚMINA, nossa missão é unir tecnologia de ponta e ciência da
               educação para oferecer planos de estudo personalizados que se
               adaptam ao seu ritmo de aprendizado. Acreditamos que cada
               estudante é único e merece um acompanhamento inteligente para
               alcançar seus objetivos acadêmicos de forma saudável e
               sustentável.
            </p>

            {/* Cards de valores */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
               <Card className="bg-white/10 border-transparent">
                  <CardHeader>
                     <CardTitle className="flex items-center justify-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Comunidade
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <CardDescription>
                        Mais de 10.000 usuários ativos trocando experiências e
                        motivação para atingir suas metas juntos.
                     </CardDescription>
                  </CardContent>
               </Card>

               <Card className="bg-white/10 border-transparent">
                  <CardHeader>
                     <CardTitle className="flex items-center justify-center gap-2">
                        <HeartPulse className="h-5 w-5 text-primary" />
                        Aprendizado em Primeiro Lugar
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <CardDescription>
                        Monitoramento contínuo do progresso acadêmico para
                        garantir eficiência e qualidade nos estudos.
                     </CardDescription>
                  </CardContent>
               </Card>

               <Card className="bg-white/10 border-transparent">
                  <CardHeader>
                     <CardTitle className="flex items-center justify-center gap-2">
                        <ChartLine className="h-5 w-5 text-primary" />
                        Resultados Visíveis
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <CardDescription>
                        Relatórios detalhados para acompanhar seu desempenho
                        acadêmico e ajustar seu plano de estudos em tempo real.
                     </CardDescription>
                  </CardContent>
               </Card>
            </div>

            {/* CTA final */}
            <div className="mt-12 text-center">
               <Button size="lg" className="px-10 cursor-pointer">
                  Junte-se à Comunidade
               </Button>
            </div>
         </div>
      </section>
   );
}
