export interface MetricDataResponseDTO {
  id: string;
  metricType: string; // Ex: "WEIGHT", "GRADE"
  data: Record<string, any>; // ou Record<string, unknown> se quiser mais segurança
  createdAt: string;

}

export interface ImportResultResponseDTO {
  totalRecords: number;
  errorMessages: string[];
}


export interface MetricDataRequestDTO {
  metricType: string;
  source: string;
  data: Record<string, any>;
  
}
