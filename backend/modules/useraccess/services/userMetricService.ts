import type {
  MetricDataRequestDTO,
  MetricDataResponseDTO,
  ImportResultResponseDTO,
} from "@/backend/modules/useraccess/types/userMetricTypes";
import { apiRequest } from "@/backend/api";

export const userMetricService = {
  /**
   * Importa métricas via arquivo (CSV, Excel, etc)
   */
async importMetrics(
  file: File,
  metricType: string,
): Promise<ImportResultResponseDTO> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("metricType", metricType);
  return await apiRequest<ImportResultResponseDTO>({
    method: "post",
    path: "/metrica/importar",
    data: formData,
  });
},

  /**
   * Lista métricas por tipo (usando ID do tipo)
   */
  async getByTypeId(
    metricTypeId: string,
  ): Promise<MetricDataResponseDTO[]> {
    return await apiRequest<MetricDataResponseDTO[]>({
      method: "get",
      path: `/metrica/listar/tipo/id/${metricTypeId}`
    });
  },

  /**
   * Lista métricas por tipo (usando nome do tipo)
   */
  async getByTypeName(
    nameMetricType: string,
  ): Promise<MetricDataResponseDTO[]> {
    return await apiRequest<MetricDataResponseDTO[]>({
      method: "get",
      path: `/metrica/listar/tipo/nome/${nameMetricType}`
    });
  },

  /**
   * Adiciona uma nova métrica
   */
  async addMetric(
    payload: MetricDataRequestDTO
  ): Promise<MetricDataResponseDTO> {
    return await apiRequest<MetricDataResponseDTO, MetricDataRequestDTO>({
      method: "post",
      path: "/metrica/adicionar",
      data: payload
    });
  },

  /**
   * Remove uma métrica existente
   */
  async removeMetric(metricTypeId: string): Promise<void> {
    return await apiRequest<void>({
      method: "delete",
      path: `/metrica/remover/${metricTypeId}`,
    });
  },
};
