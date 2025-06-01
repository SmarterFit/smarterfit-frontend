"use client";

import React from "react";
import { TrainingGroupTable } from "./TrainingGroupTable";
import CreateTrainingGroupForm from "../forms/CreateTrainingGroupForm";
import { Separator } from "../ui/separator";

interface TrainingGroupManagerProps {
   userId: string;
}

export default function TrainingGroupManagerTab({
   userId,
}: TrainingGroupManagerProps) {
   return (
      <div className="flex flex-col gap-4">
         {/* Formulário de criação */}
         <CreateTrainingGroupForm ownerId={userId} />
         <Separator />
         {/* Tabela de busca */}
         <TrainingGroupTable userId={userId} />
      </div>
   );
}
