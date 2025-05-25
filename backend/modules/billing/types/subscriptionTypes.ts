import { SubscriptionStatus } from "@/backend/common/enums/subscriptionStatusEnum";
import { UserResponseDTO } from "../../useraccess/types/userTypes";
import { CreatedPlanResponseDTO } from "./planTypes";

export interface SubscriptionResponseDTO {
   id: string; // UUID como string
   owner: UserResponseDTO;
   plan: CreatedPlanResponseDTO;
   startedIn: string; // ISO datetime string
   renewedIn: string; // ISO datetime string
   endedIn: string; // ISO datetime string
   status: SubscriptionStatus;
   availableMembers: number;
   availableClasses: number;
}

export interface SubscriptionStatusCountResponseDTO {
   renewedCount: number; // Long do Java vira number no TS
   createdCount: number;
   canceledCount: number;
   pendingCount: number;
   expiredCount: number;
   activeCount: number;
}
