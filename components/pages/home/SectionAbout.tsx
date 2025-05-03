"use client";

import Section from "@/components/base/containers/section/Section";

export default function SectionAbout() {
   return (
      <Section
         id="section-about"
         className="relative bg-[url(/imgs/about.jpg)] bg-cover bg-center bg-no-repeat"
      >
         {/* Sobreposição escura para manter a consistência com a seção hero */}
         <div className="absolute inset-0 bg-dark/80"></div>

         {/* Conteúdo principal da seção */}
         <div className="relative flex flex-col items-center text-center text-white px-6 py-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
               Sobre a SmarterFit
            </h2>
            <p className="text-lg sm:text-xl mb-8">
               Na SmarterFit, acreditamos que a saúde e o bem-estar são
               essenciais para uma vida plena. Nossa missão é transformar a sua
               jornada de fitness com planos de treino personalizados, apoiados
               por tecnologia de ponta e uma equipe altamente qualificada.
            </p>
            <p className="text-lg sm:text-xl">
               Com uma infraestrutura moderna e equipamentos de última geração,
               criamos um ambiente acolhedor e motivador. Venha nos conhecer e
               descubra como podemos ajudar você a atingir seus objetivos.
            </p>
         </div>
      </Section>
   );
}
