"use client";

import { useEffect, useState } from "react";
import { ModalityResponseDTO } from "@/backend/modules/classgroup/types/modalityTypes";
import { modalityService } from "@/backend/modules/classgroup/service/modalityService";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ModalityDialog } from "@/components/dialogs/classgroup/ModalityDialog";
import { ModalityTable } from "./ModalityTable";

export function ModalityTab() {
  const [modalities, setModalities] = useState<ModalityResponseDTO[]>([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    modalityService.getAll().then(setModalities);
  }, [refresh]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Lista de Modalidades</h2>
        <ModalityDialog onCreated={() => setRefresh(!refresh)}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nova Modalidade
          </Button>
        </ModalityDialog>
      </div>

      <ModalityTable modalities={modalities} onDeleted={() => setRefresh(!refresh)} />
    </div>
  );
}
