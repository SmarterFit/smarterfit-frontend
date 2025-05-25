export interface CreatedPlanResponseDTO {
   id: string; // UUID
   name: string;
   description: string;
   price: number;
   duration: number;
   maxUsers: number;
   maxClasses: number;
   deletedAt?: string; // ISO date, ou null se não deletado
}

export interface PlanResponseDTO {
   id: string; // UUID
   name: string;
}
