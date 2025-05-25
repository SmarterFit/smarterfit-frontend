"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel";
import type { CreatedPlanResponseDTO } from "@/backend/modules/billing/types/planTypes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { planService } from "@/backend/modules/billing/services/planServices";

export default function SectionPlans() {
   const [plans, setPlans] = useState<CreatedPlanResponseDTO[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      planService
         .search({}, 0, 10)
         .then((page) => {
            setPlans(page.content);
         })
         .catch((err) => {
            console.error(err);
            setError("Falha ao carregar planos");
         })
         .finally(() => setLoading(false));
   }, []);

   return (
      <section
         id="planos"
         className="relative w-full min-h-screen bg-cover bg-center pt-16"
         style={{ backgroundImage: "url('/imgs/plans-bg.jpg')" }}
      >
         {/* Overlay escuro */}
         <div className="absolute inset-0 bg-black/90 z-10" />

         <div className="container mx-auto relative z-20 p-4 py-32 min-h-screen flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
               Nossos Planos
            </h2>

            {loading && (
               <p className="text-center text-white">Carregando planos...</p>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
               <Carousel>
                  <CarouselContent className="space-x-6">
                     {plans.map((plan) => (
                        <CarouselItem
                           key={plan.id}
                           className="snap-start flex-shrink-0 md:basis-1/3 "
                        >
                           <Card className="bg-white/10 border-transparent text-white h-full justify-between">
                              <CardHeader>
                                 <CardTitle className="text-xl font-semibold">
                                    {plan.name}
                                 </CardTitle>
                              </CardHeader>
                              <CardContent>
                                 <p className="mb-4 text-sm opacity-90">
                                    {plan.description}
                                 </p>
                                 <div className="space-y-2">
                                    <p>
                                       <span className="font-semibold">
                                          Preço:
                                       </span>{" "}
                                       R$ {plan.price.toFixed(2)}
                                    </p>
                                    <p>
                                       <span className="font-semibold">
                                          Duração:
                                       </span>{" "}
                                       {plan.duration}{" "}
                                       {plan.duration > 1 ? "meses" : "mês"}
                                    </p>
                                    <p>
                                       <span className="font-semibold">
                                          Turmas:
                                       </span>{" "}
                                       até {plan.maxClasses}
                                    </p>
                                 </div>
                                 <div className="mt-6 text-center">
                                    <Button
                                       size="lg"
                                       className="w-full cursor-pointer"
                                    >
                                       Assinar
                                    </Button>
                                 </div>
                              </CardContent>
                           </Card>
                        </CarouselItem>
                     ))}
                  </CarouselContent>
               </Carousel>
            )}
         </div>
      </section>
   );
}
