"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ClassSessionService } from "@/backend/modules/classgroup/service/ClassGroupSessionService";
import { ClassSessionResponseDTO } from "@/backend/modules/classgroup/types/classGroupSessionTypes";
import { SessionStatus, SessionStatusLabels } from "@/backend/common/enums/sessionStatus";
import { ErrorToast, SuccessToast } from "../../toasts/Toasts";
import { format, parse } from "date-fns";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const SessionSchema = z.object({
  description: z.string().optional(),
  startTime: z.string().min(1, "Data de início é obrigatória"),
  endTime: z.string().min(1, "Data de término é obrigatória"),
  sessionStatus: z.nativeEnum(SessionStatus),
  capacity: z.number().optional(),
});

interface EditSessionDialogProps {
  children: React.ReactNode;
  classGroupId: string;
  session?: ClassSessionResponseDTO;
  onSuccess?: () => void;
}

export function EditSessionDialog({
  children,
  classGroupId,
  session,
  onSuccess,
}: EditSessionDialogProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(SessionSchema),
    defaultValues: {
      description: "",
      startTime: "",
      endTime: "",
      sessionStatus: SessionStatus.SCHEDULED,
      capacity: undefined,
    },
  });

  // Atualiza os campos do formulário quando `session` muda
  useEffect(() => {
    if (session) {
      // Converte o formato de data do backend para o formato do input datetime-local
      const formatForInput = (dateTime: string) => {
        try {
          const parsedDate = parse(dateTime, "dd-MM-yyyy HH:mm:ss", new Date());
          return format(parsedDate, "yyyy-MM-dd'T'HH:mm");
        } catch {
          return "";
        }
      };

      form.reset({
        description: session.description || "",
        startTime: formatForInput(session.startTime),
        endTime: formatForInput(session.endTime),
        sessionStatus: session.sessionStatus,
        capacity: session.capacity,
      });
    } else {
      form.reset({
        description: "",
        startTime: "",
        endTime: "",
        sessionStatus: SessionStatus.SCHEDULED,
        capacity: undefined,
      });
    }
  }, [session, form]);

  const formatForBackend = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      return format(date, "dd-MM-yyyy HH:mm:ss");
    } catch {
      return dateTime;
    }
  };

  const onSubmit = async (data: z.infer<typeof SessionSchema>) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        ErrorToast("Sessão expirada. Faça login novamente.");
        router.push("/login");
        return;
      }

      const payload = {
        ...data,
        startTime: formatForBackend(data.startTime),
        endTime: formatForBackend(data.endTime),
        status: data.sessionStatus
      };
      

      if (session) {
        await ClassSessionService.update(session.id, payload);
        SuccessToast("", "Aula atualizada com sucesso");
      } else {
        await ClassSessionService.create({
          ...payload,
          classGroupId,
        });
        SuccessToast("", "Aula agendada com sucesso");
      }

      onSuccess?.();
    } catch (error: any) {
      console.error("Erro ao salvar aula:", error);
      if (error.response?.status === 401) {
        ErrorToast("Acesso não autorizado. Verifique suas permissões.");
        router.push("/login");
      } else {
        ErrorToast(error.message || "Erro ao salvar aula");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {session ? "Editar Aula" : "Agendar Nova Aula"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Descrição</Label>
            <Input {...form.register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data/Hora Início*</Label>
              <Input 
                type="datetime-local" 
                {...form.register("startTime")}
                className="[&::-webkit-calendar-picker-indicator]:invert-[1]"
              />
            </div>
            <div>
              <Label>Data/Hora Término*</Label>
              <Input 
                type="datetime-local" 
                {...form.register("endTime")}
                className="[&::-webkit-calendar-picker-indicator]:invert-[1]"
              />
            </div>
          </div>

          <div>
            <Label>Status*</Label>
            <Select
              value={form.watch("sessionStatus")}
              onValueChange={(value) =>
                form.setValue("sessionStatus", value as SessionStatus)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SessionStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            {session ? "Salvar Alterações" : "Agendar Aula"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}