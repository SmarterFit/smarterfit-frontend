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


