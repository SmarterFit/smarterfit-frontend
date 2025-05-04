"use client";

import React, { useEffect, useState } from "react";
import Section from "@/components/base/containers/section/Section";
import { Dumbbell as PlanIcon } from "lucide-react";
import Carousel from "@/components/base/containers/carousel/Carousel";
import {
   ClassGroupResponseDTO,
   fetchClassGroups,
} from "@/lib/services/classgroup/classGroupService";
import ClassGroupCard from "@/components/base/containers/card/ClassGroupCard";

export default function SectionClasses() {
   const [classGroups, setClassGroups] = useState<ClassGroupResponseDTO[]>([]);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      async function loadClassGroups() {
         try {
            const data = await fetchClassGroups();
            setClassGroups(data);
         } catch (err: any) {
            setError(err.message);
         }
      }
      loadClassGroups();
   }, []);

   return (
      <Section id="section-classes" className="flex-col justify-baseline">
         <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white my-16">
            Turmas
         </h2>
         <p className="text-lg sm:text-xl mb-8 text-white">
            Inúmeras turmas para todos os gostos.
         </p>
         {error ? (
            <div className="text-center">
               <p className="text-red-500">
                  Não foi possível obter os dados das turmas.
                  {error}
               </p>
            </div>
         ) : classGroups.length !== 0 ? (
            <Carousel
               itemsToShow={{
                  base: 1,
                  sm: 2,
                  md: 3,
                  lg: 4,
               }}
               showDots={true}
               showArrows={true}
               gap={16}
               className="mb-16"
            >
               {classGroups.map((classGroup) => (
                  <ClassGroupCard
                     key={classGroup.id}
                     classGroup={classGroup}
                     icon={<PlanIcon width={32} height={32} />}
                  />
               ))}
            </Carousel>
         ) : (
            <p className="text-center text-white">Nenhuma turma encontrada.</p>
         )}
      </Section>
   );
}
