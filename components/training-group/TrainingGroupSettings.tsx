import React from "react";
import { UpdateTrainingGroupRequestDTO } from "@/backend/modules/training-group/schemas/trainingGroupSchemas";
import { TrainingGroupOptions } from "./TrainingGroupOptions";
import { UpdateTrainingGroupForm } from "../forms/UpdateTrainingGroupForm";
import { Separator } from "../ui/separator";
import { TrainingGroupResponseDTO } from "@/backend/modules/training-group/types/trainingGroupTypes";

interface TrainingGroupSettingProps {
   initialData: TrainingGroupResponseDTO;
   onChange: (updated?: TrainingGroupResponseDTO) => void;
}

export function TrainingGroupSettings({
   initialData,
   onChange,
}: TrainingGroupSettingProps) {
   return (
      <div className="space-y-8">
         <UpdateTrainingGroupForm
            initialData={initialData}
            onSuccess={onChange}
         />

         <Separator />

         <TrainingGroupOptions
            id={initialData.id}
            startDate={initialData.startDate}
            endDate={initialData.endDate}
            onChange={onChange}
         />
      </div>
   );
}
