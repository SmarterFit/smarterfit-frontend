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
               Sobre a HUBpro
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-lg md:text-xl">
               Na HUBpro, nossa missão é unir tecnologia de ponta, ciência de
               dados e andragogia para oferecer planos de desenvolvimento
               personalizados que se adaptam à sua rotina profissional.
               Acreditamos que cada colaborador é único e merece um
               acompanhamento inteligente para alcançar seus objetivos de
               carreira de forma estratégica e sustentável.
            </p>

            {/* Cards de valores */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
               <Card className="bg-white/10 border-transparent">
                  <CardHeader>
                     <CardTitle className="flex items-center justify-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Comunidade Corporativa
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <CardDescription>
                        Mais de 10.000 colaboradores engajados trocando
                        conhecimento, insights e melhores práticas para
                        impulsionar o crescimento coletivo.
                     </CardDescription>
                  </CardContent>
               </Card>

               <Card className="bg-white/10 border-transparent">
                  <CardHeader>
                     <CardTitle className="flex items-center justify-center gap-2">
                        <HeartPulse className="h-5 w-5 text-primary" />
                        Desenvolvimento Sustentável
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <CardDescription>
                        Acompanhamento contínuo do seu progresso para garantir
                        um desenvolvimento profissional equilibrado, eficiente e
                        sem sobrecarga.
                     </CardDescription>
                  </CardContent>
               </Card>

               <Card className="bg-white/10 border-transparent">
                  <CardHeader>
                     <CardTitle className="flex items-center justify-center gap-2">
                        <ChartLine className="h-5 w-5 text-primary" />
                        Resultados Mensuráveis
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <CardDescription>
                        Dashboards e relatórios detalhados para acompanhar a
                        evolução de suas competências e ajustar sua trilha de
                        desenvolvimento em tempo real.
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
