import { ProfileMetricType } from "@/backend/common/enums/profileMetricEnum";

export interface ProfileMetricResponseDTO {
   id: string;
   type: ProfileMetricType;
   value: number;
   createdAt: string;
}


export interface MetricTypeResponseDTO {
  id: string;
  type: string; 
  unit: string;
  minThreshold: number;
  maxThreshold: number;
  enabled: boolean;
}


export interface MetricTypeRequestDTO {
  type: string; 
  unit: string;
  minThreshold: number;
  maxThreshold: number;
}


