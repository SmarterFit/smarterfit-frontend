import { apiRequest } from "@/lib/apiRequest";

export type SearchPlanRequestDTO = {
   nameTerm?: string;
   minPrice?: number;
   maxPrice?: number;
   minDuration?: number;
   maxDuration?: number;
   minMaxUsers?: number;
   maxMaxUsers?: number;
   minMaxClasses?: number;
   maxMaxClasses?: number;
   includeDeleted?: boolean;
};

export type PlanResponseDTO = {
   id: string;
   name: string;
   description: string;
   price: number;
   duration: number;
   maxUsers: number;
   maxClasses: number;
   deletedAt?: string;
};

export async function fetchPlans(
   searchParams: SearchPlanRequestDTO,
   page: number = 0,
   size: number = 10
): Promise<PlanResponseDTO[]> {
   const response = await apiRequest<{ content: PlanResponseDTO[] }>(
      "GET",
      "/planos/buscar",
      undefined,
      { params: { ...searchParams, page, size } }
   );
   return response.content;
}
