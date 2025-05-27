import { ModalityResponseDTO } from "@/backend/modules/classgroup/types/modalityTypes";
import { modalityService } from "@/backend/modules/classgroup/service/modalityService";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

type Props = {
  modalities: ModalityResponseDTO[];
  onDeleted: () => void;
};

export function ModalityTable({ modalities, onDeleted }: Props) {
  const handleDelete = async (id: string) => {
    await modalityService.delete(id);
    onDeleted();
  };

  if (!modalities.length) return <p className="text-muted-foreground">Nenhuma modalidade cadastrada.</p>;

  return (
    <div className="border rounded-md">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {modalities.map((modality) => (
            <tr key={modality.id} className="border-t">
              <td className="p-2">{modality.name}</td>
              <td className="p-2 text-right">
                <Button variant="ghost" size="sm" onClick={() => handleDelete(modality.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
