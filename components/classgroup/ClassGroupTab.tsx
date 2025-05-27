"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays } from "lucide-react";
import { ClassGroupService } from "@/backend/modules/classgroup/service/classGroupService";
import type { ClassGroupResponseDTO } from "@/backend/modules/classgroup/types/classGroupTypes";
import { ClassGroupDialog } from "@/components/dialogs/ClassGroupDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export function ClassGroupTab() {
  const [turmas, setTurmas] = useState<ClassGroupResponseDTO[]>([]);
  const router = useRouter();

  const fetchTurmas = async () => {
    const data = await ClassGroupService.getAll();
    setTurmas(data);
  };

  const handleViewDetails = (turma: ClassGroupResponseDTO) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("selectedTurmaId", turma.id);
    }
    router.push(`/dashboard/turmas/${turma.slug}`);
  };

  useEffect(() => {
    fetchTurmas();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      timeZone: 'UTC'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Lista de Turmas</h2>
        <ClassGroupDialog onCreated={fetchTurmas}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Nova Turma
          </Button>
        </ClassGroupDialog>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 w-full">
        {turmas.map((turma) => (
          <Card key={turma.id} className="w-full hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3 space-y-2">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg font-semibold line-clamp-2 text-gray-900 dark:text-white">
                  {turma.title}
                </CardTitle>
                <Badge 
                  variant={turma.totalMembers >= turma.capacity ? "destructive" : "default"}
                  className="shrink-0"
                >
                  {turma.totalMembers}/{turma.capacity}
                </Badge>
              </div>
              <Badge 
                variant="outline" 
                className="w-fit bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              >
                {turma.modalityDTO.name}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <CalendarDays className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-muted-foreground">Início:</span>
                    <span className="text-gray-700 dark:text-gray-300">{formatDate(turma.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-muted-foreground">Término:</span>
                    <span className="text-gray-700 dark:text-gray-300">{formatDate(turma.endDate)}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Ocupação</span>
                  <span>{Math.round((turma.totalMembers / turma.capacity) * 100)}%</span>
                </div>
                <div className="relative h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-primary rounded-full" 
                    style={{
                      width: `${Math.min(100, (turma.totalMembers / turma.capacity) * 100)}%`
                    }}
                  />
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full mt-3"
                onClick={() => handleViewDetails(turma)}
              >
                Ver detalhes
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}