import {
  Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateModalitySchemas } from "@/backend/modules/classgroup/schemas/modalitySchemas";
import { z } from "zod";
import { modalityService } from "@/backend/modules/classgroup/service/modalityService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";

type Props = {
  children: React.ReactNode;
  onCreated?: () => void;
};

export function ModalityDialog({ children, onCreated }: Props) {
  const form = useForm<z.infer<typeof CreateModalitySchemas>>({
    resolver: zodResolver(CreateModalitySchemas),
  });

  const onSubmit = async (data: z.infer<typeof CreateModalitySchemas>) => {
    await modalityService.create(data);
    form.reset();
    onCreated?.();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Criar Modalidade</DialogTitle>
        <DialogDescription>Insira o nome da nova modalidade abaixo.</DialogDescription>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Nome da Modalidade</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <Button type="submit">Criar Modalidade</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
