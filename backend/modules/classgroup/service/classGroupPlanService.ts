import { apiRequest } from "@/backend/api";
import type { CreateClassGroupPlanDTO } from "@/backend/modules/classgroup/types/classGroupPlanTypes";
import type { PlanResponseDTO } from "@/backend/modules/billing/types/planTypes";

export const classGroupPlanService = {
  /**
   * Adiciona um plano a uma turma (ADMIN)
   */
  addPlanToClassGroup(
    payload: CreateClassGroupPlanDTO
  ): Promise<void> {
    return apiRequest<void, CreateClassGroupPlanDTO>({
      method: "post",
      path: "/turma/planos/cadastrar",
      data: payload,
    });
  },

  /**
   * Retorna os planos associados a uma turma
   */
  getPlansToClassGroup(
    classGroupId: string
  ): Promise<PlanResponseDTO[]> {
    return apiRequest<PlanResponseDTO[]>({
      method: "get",
      path: `/turma/planos/${classGroupId}`,
    });
  },

  /**
   * Remove um plano de uma turma (ADMIN)
   */
  removePlanToClassGroup(
    classGroupId: string,
    planId: string
  ): Promise<void> {
    return apiRequest<void>({
      method: "delete",
      path: `/turma/${classGroupId}/planos/${planId}`,
    });
  },
};
