"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Trash2, Plus } from "lucide-react";
import { ErrorToast, SuccessToast } from "@/components/toasts/Toasts";
import { AddPlanToClassDialog } from "@/components/dialogs/classgroup/AddPlanToClassDialog";
import { Button } from "@/components/ui/button";
import { classGroupPlanService } from "@/backend/modules/classgroup/service/classGroupPlanService";
import type { PlanResponseDTO } from "@/backend/modules/billing/types/planTypes";

interface PlansClassTabProps {
  classGroupId: string;
}

export function PlansClassTab({ classGroupId }: PlansClassTabProps) {
  const [plans, setPlans] = useState<PlanResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingPlanId, setRemovingPlanId] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    if (!classGroupId) return;
    setLoading(true);
    try {
      const data = await classGroupPlanService.getPlansToClassGroup(classGroupId);
      setPlans(Array.isArray(data) ? data : []);
    } catch {
      ErrorToast("Falha ao carregar planos da turma");
    } finally {
      setLoading(false);
    }
  }, [classGroupId]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleRemovePlan = async (planId: string) => {
    setRemovingPlanId(planId);
    try {
      await classGroupPlanService.removePlanToClassGroup(classGroupId, planId);
      SuccessToast("Plano desvinculado com sucesso");
      fetchPlans(); // Atualiza a lista
    } catch {
      ErrorToast("Erro ao remover plano");
    } finally {
      setRemovingPlanId(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Planos Vinculados</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Planos Vinculados</CardTitle>
          <AddPlanToClassDialog
            classGroupId={classGroupId}
            onPlanAdded={fetchPlans}
          >
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Vincular Plano
            </Button>
          </AddPlanToClassDialog>
        </div>
      </CardHeader>

      <CardContent>
        {plans.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Nenhum plano vinculado a esta turma
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="border rounded-lg p-4 flex justify-between items-center hover:bg-secondary/50 transition-colors"
              >
                <div>
                  <h3 className="font-medium">{plan.name}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePlan(plan.id)}
                  disabled={removingPlanId === plan.id}
                  className="bg-[#f87171] hover:bg-[#f43f5e] text-black h-8 px-3"
                >
                  {removingPlanId === plan.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remover
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}