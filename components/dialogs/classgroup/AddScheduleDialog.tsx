import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ErrorToast, SuccessToast } from "../../toasts/Toasts";
import type { CreateClassGroupScheduleRequestDTO } from "@/backend/modules/classgroup/types/classGroupScheduleTypes";
import { DayOfWeek } from "@/backend/common/enums/dayOfWeekEnum";
import { apiRequest } from "@/backend/api";

type Props = {
  turmaId: string;
  children: React.ReactNode;
  onCreated?: () => void;
};

export function AddScheduleDialog({ turmaId, children, onCreated }: Props) {
  const { register, handleSubmit, reset } = useForm<Omit<CreateClassGroupScheduleRequestDTO, "classGroupId">>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: Omit<CreateClassGroupScheduleRequestDTO, "classGroupId">) => {
    try {
      setIsSubmitting(true);
      const payload: CreateClassGroupScheduleRequestDTO = {
        ...data,
        classGroupId: turmaId,
      };

      await apiRequest<void, CreateClassGroupScheduleRequestDTO>({
        method: "post",
        path: "/turma/schedule/cadastrar",
        data: payload,
      });

      reset();
      SuccessToast("Sucesso!", "Horário adicionado!");
      onCreated?.();
    } catch (err) {
      ErrorToast("Erro ao adicionar horário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const dayOfWeekOptions = Object.values(DayOfWeek).filter(value => typeof value === "string") as string[];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Adicionar Horário</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Dia da Semana*</Label>
            <select {...register("dayOfWeek")} className="w-full border rounded px-2 py-1">
              <option value="">Selecione...</option>
              {dayOfWeekOptions.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Início*</Label>
              <Input type="time" {...register("startTime")} />
            </div>
            <div className="flex-1">
              <Label>Término*</Label>
              <Input type="time" {...register("endTime")} />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Adicionando..." : "Adicionar Horário"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
