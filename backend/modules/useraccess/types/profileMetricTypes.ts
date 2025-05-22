import { ProfileMetricType } from "@/backend/common/enums/profileMetricEnum";

export interface ProfileMetricResponseDTO {
   id: string;
   type: ProfileMetricType;
   value: number;
   createdAt: string;
}
