// components/classgroup/EditScheduleDialog.tsx
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ClassGroupScheduleService } from "@/backend/modules/classgroup/service/classGroupScheduleService";
import { DayOfWeek, DayOfWeekLabels } from "@/backend/common/enums/dayOfWeek";
import { ErrorToast, SuccessToast } from "../../toasts/Toasts";

const ScheduleSchema = z.object({
  dayOfWeek: z.nativeEnum(DayOfWeek, {
    required_error: "Dia da semana é obrigatório",
  }),
  startTime: z.string().min(1, "Horário de início é obrigatório"),
  endTime: z.string().min(1, "Horário de término é obrigatório"),
});

interface EditScheduleDialogProps {
  children: React.ReactNode;
  classGroupId: string;
  schedule?: {
    id: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
  };
  onSuccess?: () => void;
}

export function EditScheduleDialog({
  children,
  classGroupId,
  schedule,
  onSuccess,
}: EditScheduleDialogProps) {
  const form = useForm({
    resolver: zodResolver(ScheduleSchema),
    defaultValues: schedule || {
      dayOfWeek: undefined,
      startTime: "",
      endTime: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ScheduleSchema>) => {
    try {
      const payload = {
        classGroupId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
      };

      if (schedule) {
        await ClassGroupScheduleService.update(schedule.id, payload);
        SuccessToast("Horário atualizado com sucesso");
      } else {
        await ClassGroupScheduleService.create(payload);
        SuccessToast("Horário adicionado com sucesso");
      }

      onSuccess?.();
    } catch (error) {
      ErrorToast("Erro ao salvar horário");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {schedule ? "Editar Horário" : "Adicionar Horário"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Dia da Semana*</Label>
            <Select
              value={form.watch("dayOfWeek")}
              onValueChange={(value) =>
                form.setValue("dayOfWeek", value as DayOfWeek)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um dia" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DayOfWeekLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Horário de Início*</Label>
              <Input type="time" {...form.register("startTime")} 
              className="[&::-webkit-calendar-picker-indicator]:invert-[1]"
              />
            </div>
            <div>
              <Label>Horário de Término*</Label>
              <Input type="time" {...form.register("endTime")} 
              className="[&::-webkit-calendar-picker-indicator]:invert-[1]"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            {schedule ? "Salvar Alterações" : "Adicionar Horário"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}