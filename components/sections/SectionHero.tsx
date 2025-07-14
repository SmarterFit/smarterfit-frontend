"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
   CardDescription,
} from "@/components/ui/card";
import { Activity, Users, Target } from "lucide-react";

export default function SectionHero() {
   const titleRef = useRef<HTMLHeadingElement>(null);
   const subtitleRef = useRef<HTMLParagraphElement>(null);
   const ctaRef = useRef<HTMLDivElement>(null);
   const featuresRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(titleRef.current, { y: -50, opacity: 0, duration: 1 })
         .from(subtitleRef.current, { y: 50, opacity: 0, duration: 1 }, "-=0.5")
         .from(
            ctaRef.current,
            { scale: 0.8, opacity: 0, duration: 0.8 },
            "-=0.5"
         );

      if (featuresRef.current) {
         const children = Array.from(featuresRef.current.children);
         tl.from(
            children,
            { y: 30, opacity: 0, duration: 0.6, stagger: 0.2 },
            "-=0.6"
         );
      }
   }, []);

   return (
      <section
         className="relative w-full min-h-screen bg-cover bg-center pt-16"
         style={{ backgroundImage: "url('/imgs/hero.png')" }}
         id="inicio"
      >
         {/* Overlay */}
         <div className="absolute inset-0 bg-gradient-to-b from-background/70 to-background/50 z-10" />

         <div className="container mx-auto relative z-20 flex flex-col items-center justify-center text-center min-h-screen p-4">
            {/* Title & Subtitle */}
            <h1
               ref={titleRef}
               className="text-4xl md:text-6xl font-extrabold text-primary drop-shadow-lg"
               style={{ fontFamily: "var(--font-merienda)" }}
            >
               LÚMINA
            </h1>
            <p
               ref={subtitleRef}
               className="mt-4 text-xl md:text-2xl text-primary/90 font-medium max-w-2xl"
            >
               Aplique inteligência aos seus estudos e conquiste resultados
               reais.
            </p>

            {/* Call to Action Buttons */}
            <div ref={ctaRef} className="mt-6 flex flex-col sm:flex-row gap-4">
               <Button size="lg" className="px-8 cursor-pointer">
                  Começar Agora
               </Button>
               <Button
                  variant="outline"
                  size="lg"
                  className="px-8 cursor-pointer"
                  onClick={() => {
                     document
                        .querySelector("#sobre")
                        ?.scrollIntoView({ behavior: "smooth" });
                  }}
               >
                  Saiba Mais
               </Button>
            </div>

            {/* Features */}
            <div
               ref={featuresRef}
               className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
            >
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center justify-center gap-2">
                        <Activity className="h-6 w-6 text-primary" />
                        Estudos Personalizados
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <CardDescription className="text-center">
                        Planos de estudo personalizados construídos por IA para
                        maximizar seu aprendizado.
                     </CardDescription>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center justify-center gap-2">
                        <Users className="h-6 w-6 text-primary" />
                        Acompanhamento em Tempo Real
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <CardDescription className="text-center">
                        Monitore seu desempenho e receba feedback imediato
                        durante os estudos.
                     </CardDescription>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center justify-center gap-2">
                        <Target className="h-6 w-6 text-primary" />
                        Metas Inteligentes
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <CardDescription className="text-center">
                        Defina objetivos claros e acompanhe seu progresso
                        acadêmico com precisão.
                     </CardDescription>
                  </CardContent>
               </Card>
            </div>
         </div>
      </section>
   );
}
