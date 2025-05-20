export interface CreatePlanRequestDTO {
   name: string;
   description?: string;
   price: number;
   duration: number;
   maxUsers: number;
   maxClasses: number;
}

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

export interface SearchPlanRequestDTO {
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
}
