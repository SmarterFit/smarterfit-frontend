"use client";

import { Button } from "@/components/ui/button";
import { SessionStatus, SessionStatusLabels } from "@/backend/common/enums/sessionStatus";
import { ClassSessionResponseDTO } from "@/backend/modules/classgroup/types/classGroupSessionTypes";
import { ClassSessionService } from "@/backend/modules/classgroup/service/ClassGroupSessionService";
import { EditSessionDialog } from "@/components/dialogs/classgroup/EditSessionDialog";
import { Trash2, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SessionsTabProps {
  classGroupId: string;
}

export function SessionsTab({ classGroupId }: SessionsTabProps) {
  const [sessions, setSessions] = useState<ClassSessionResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [classGroupId]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await ClassSessionService.getAllByClassGroupId(classGroupId);
      setSessions(response);
    } catch (error) {
      ErrorToast("Erro ao carregar aulas");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await ClassSessionService.delete(id);
      SuccessToast("", "Aula removida com sucesso");
      loadSessions();
    } catch (error) {
      ErrorToast("Erro ao remover aula");
    }
  };

  const formatDate = (dateTimeString: string) => {
    try {
      const date = parse(dateTimeString, "dd-MM-yyyy HH:mm:ss", new Date());
      return format(date, "EEEE, dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateTimeString;
    }
  };

  const formatTime = (dateTimeString: string) => {
    try {
      const date = parse(dateTimeString, "dd-MM-yyyy HH:mm:ss", new Date());
      return format(date, "HH:mm");
    } catch {
      return dateTimeString;
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Aulas Agendadas</h3>
        <EditSessionDialog
          classGroupId={classGroupId}
          onSuccess={loadSessions}
        >
          <Button>Agendar Nova Aula</Button>
        </EditSessionDialog>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma aula agendada
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <div key={session.id} className="border rounded-lg overflow-hidden">
              <div className="p-4 bg-secondary">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">
                    {session.description || "Aula sem descrição"}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    session.status === SessionStatus.CONFIRMED 
                      ? "bg-green-100 text-green-800" 
                      : session.status === SessionStatus.CANCELLED 
                        ? "bg-red-100 text-red-800" 
                        : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {SessionStatusLabels[session.status as keyof typeof SessionStatusLabels] || "Status desconhecido"}

                  </span>
                </div>
              </div>
              
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatDate(session.startTime)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                  </span>
                </div>
              </div>
              
              <div className="border-t p-3 flex justify-end gap-2">
                <EditSessionDialog
                  classGroupId={classGroupId}
                  session={session}
                  onSuccess={loadSessions}
                >
                  <Button variant="outline" size="sm">Editar</Button>
                </EditSessionDialog>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(session.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}