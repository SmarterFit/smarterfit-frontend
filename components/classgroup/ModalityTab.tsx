"use client";

import { useEffect, useState } from "react";
import { ModalityResponseDTO } from "@/backend/modules/classgroup/types/modalityTypes";
import { modalityService } from "@/backend/modules/classgroup/service/modalityService";
import { Button } from "@/components/ui/button";
import { Trash, Plus } from "lucide-react";
import { ModalityDialog } from "@/components/dialogs/classgroup/ModalityDialog";
import { useAuthorization } from "@/hooks/useAuthorization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function ModalityTab() {
  const [modalities, setModalities] = useState<ModalityResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const { isMember } = useAuthorization();

  useEffect(() => {
    setLoading(true);
    modalityService.getAll()
      .then(setModalities)
      .finally(() => setLoading(false));
  }, [refresh]);

  const handleDelete = async (id: string) => {
    await modalityService.delete(id);
    setRefresh(!refresh);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Modalidades</h2>
        {!isMember() && (
          <ModalityDialog onCreated={() => setRefresh(!refresh)}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Modalidade
            </Button>
          </ModalityDialog>
        )}
      </div>

      {modalities.length === 0 ? (
        <Card className="text-center p-8">
          <p className="text-muted-foreground">Nenhuma modalidade cadastrada.</p>
          {!isMember() && (
            <ModalityDialog onCreated={() => setRefresh(!refresh)}>
              <Button variant="link" className="mt-4">
                Criar primeira modalidade
              </Button>
            </ModalityDialog>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modalities.map((modality) => (
            <Card key={modality.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">
                  {modality.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/icons/modality-${modality.id.slice(-1)}.svg`} />
                      <AvatarFallback>{modality.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  {!isMember() && (
                    <Button
                      size="sm"
                      onClick={() => handleDelete(modality.id)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}