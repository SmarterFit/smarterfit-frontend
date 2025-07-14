import {
   Dialog,
   DialogContent,
   DialogTrigger,
   DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateClassGroupSchema } from "@/backend/modules/classgroup/schemas/classGroupSchemas";
import { z } from "zod";
import { ClassGroupService } from "@/backend/modules/classgroup/service/classGroupService";
import { useEffect, useState } from "react";
import {
   Select,
   SelectTrigger,
   SelectContent,
   SelectItem,
   SelectValue,
} from "@/components/ui/select";
import { modalityService } from "@/backend/modules/classgroup/service/modalityService";
import { ErrorToast, SuccessToast } from "../../toasts/Toasts";
import { ModalityResponseDTO } from "@/backend/modules/classgroup/types/modalityTypes";

type Props = {
   children: React.ReactNode;
   turmaId: string;
   defaultValues: z.infer<typeof CreateClassGroupSchema>;
   onUpdated?: () => void;
};

export function EditClassGroupDialog({
   children,
   turmaId,
   defaultValues,
   onUpdated,
}: Props) {
   const form = useForm<z.infer<typeof CreateClassGroupSchema>>({
      resolver: zodResolver(CreateClassGroupSchema),
      defaultValues,
   });

   const [modalidades, setModalidades] = useState<ModalityResponseDTO[]>([]);
   const [isSubmitting, setIsSubmitting] = useState(false);

   useEffect(() => {
      modalityService.getAll().then(setModalidades);
   }, []);

   const onSubmit = async (data: z.infer<typeof CreateClassGroupSchema>) => {
      try {
         setIsSubmitting(true);
         const payload = {
            ...data,
            startDate: formatDateForBackend(data.startDate),
            endDate: formatDateForBackend(data.endDate),
         };
         await ClassGroupService.update(turmaId, payload);
         onUpdated?.();
         SuccessToast("Turma atualizada com sucesso!", "");
      } catch (error: any) {
         ErrorToast(
            error.response?.data?.message || "Erro ao atualizar turma."
         );
      } finally {
         setIsSubmitting(false);
      }
   };

   const formatDateForBackend = (dateString: string) => {
      if (!dateString) return "";
      return new Date(dateString).toISOString().split("T")[0];
   };

   return (
      <Dialog>
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent>
            <DialogTitle>Editar Turma</DialogTitle>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
               <div>
                  <Label htmlFor="title">Título*</Label>
                  <Input id="title" {...form.register("title")} />
               </div>

               <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input id="description" {...form.register("description")} />
               </div>

               <div>
                  <Label htmlFor="capacity">Capacidade*</Label>
                  <Input
                     type="number"
                     {...form.register("capacity", { valueAsNumber: true })}
                  />
               </div>

               <div>
                  <Label>Modalidade*</Label>
                  <Select
                     value={form.watch("modalityId")}
                     onValueChange={(value) =>
                        form.setValue("modalityId", value)
                     }
                  >
                     <SelectTrigger>
                        <SelectValue placeholder="Selecione uma modalidade" />
                     </SelectTrigger>
                     <SelectContent>
                        {modalidades.map((mod: any) => (
                           <SelectItem key={mod.id} value={mod.id}>
                              {mod.name}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               <div className="flex gap-2">
                  <div className="flex-1">
                     <Label>Data Início*</Label>
                     <Input
                        type="date"
                        {...form.register("startDate")}
                        className="[&::-webkit-calendar-picker-indicator]:invert-[1]"
                     />
                  </div>
                  <div className="flex-1">
                     <Label>Data Término*</Label>
                     <Input
                        type="date"
                        {...form.register("endDate")}
                        className="[&::-webkit-calendar-picker-indicator]:invert-[1]"
                     />
                  </div>
               </div>

               <div className="flex items-center space-x-2">
                  <Checkbox
                     id="autoGeneratedSessions"
                     checked={form.watch("autoGeneratedSessions")}
                     onCheckedChange={(checked) =>
                        form.setValue("autoGeneratedSessions", !!checked)
                     }
                  />
                  <Label htmlFor="autoGeneratedSessions">
                     Gerar sessões automaticamente
                  </Label>
               </div>

               <div className="flex items-center space-x-2">
                  <Checkbox
                     id="isEvent"
                     checked={form.watch("isEvent")}
                     onCheckedChange={(checked) =>
                        form.setValue("isEvent", !!checked)
                     }
                  />
                  <Label htmlFor="isEvent">É um evento?</Label>
               </div>

               <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar Alterações"}
               </Button>
            </form>
         </DialogContent>
      </Dialog>
   );
}
