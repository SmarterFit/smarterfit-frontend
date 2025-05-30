"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { SuccessToast, ErrorToast } from "@/components/toasts/Toasts";
import { classGroupPlanService } from "@/backend/modules/classgroup/service/classGroupPlanService";
import { planService } from "@/backend/modules/billing/services/planServices";
import type { PlanResponseDTO } from "@/backend/modules/billing/types/planTypes";

interface AddPlanDialogProps {
  classGroupId: string;
  onPlanAdded: () => void;
  children: React.ReactNode;
}

export function AddPlanToClassDialog({
  classGroupId,
  onPlanAdded,
  children,
}: AddPlanDialogProps) {
  const [open, setOpen] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<PlanResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingPlanId, setAddingPlanId] = useState<string | null>(null);

  const fetchAvailablePlans = useCallback(async () => {
    setLoading(true);
    try {
      const allPlans = await planService.getAll();
      setAvailablePlans(allPlans);
    } catch {
      ErrorToast("Falha ao carregar planos disponíveis");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddPlan = useCallback(
    async (planId: string) => {
      setAddingPlanId(planId);
      try {
        await classGroupPlanService.addPlanToClassGroup({
          classGroupId,
          planId,
        });
        SuccessToast("Sucesso", "Plano vinculado à turma!");
        onPlanAdded();
        setOpen(false);
      } catch {
        ErrorToast("Falha ao vincular plano");
      } finally {
        setAddingPlanId(null);
      }
    },
    [classGroupId, onPlanAdded]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) fetchAvailablePlans();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vincular Plano à Turma</DialogTitle>
          <DialogDescription>
            Selecione um dos planos disponíveis abaixo.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : availablePlans.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            Nenhum plano disponível.
          </p>
        ) : (
          <div className="space-y-2">
            {availablePlans.map((plan) => (
              <div
                key={plan.id}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{plan.name}</h4>
                  <p className="text-sm text-muted-foreground">
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddPlan(plan.id)}
                  disabled={addingPlanId === plan.id}
                >
                  {addingPlanId === plan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
