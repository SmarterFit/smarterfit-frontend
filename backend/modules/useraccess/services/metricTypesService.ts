import type { MetricTypeRequestDTO } from "@/backend/modules/useraccess/types/profileMetricTypes";
import type { MetricTypeResponseDTO } from "@/backend/modules/useraccess/types/profileMetricTypes";
import { apiRequest } from "@/backend/api";

export const metricTypeService = {
  /**
   * Cria um novo tipo de métrica
   */
  create(payload: MetricTypeRequestDTO): Promise<MetricTypeResponseDTO> {
    return apiRequest<MetricTypeResponseDTO, MetricTypeRequestDTO>({
      method: "post",
      path: "/metrica/tipo/cadastrar",
      data: payload,
    });
  },

  /**
   * Busca um tipo de métrica pelo ID
   */
  getById(id: string): Promise<MetricTypeResponseDTO> {
    return apiRequest<MetricTypeResponseDTO>({
      method: "get",
      path: `/metrica/tipo/${id}`,
    });
  },

  /**
   * Lista todos os tipos de métricas
   */
  getAll(): Promise<MetricTypeResponseDTO[]> {
    return apiRequest<MetricTypeResponseDTO[]>({
      method: "get",
      path: `/metrica/tipo`,
    });
  },

  /**
   * Atualiza um tipo de métrica existente
   */
  updateById(id: string, payload: MetricTypeRequestDTO): Promise<MetricTypeResponseDTO> {
    return apiRequest<MetricTypeResponseDTO, MetricTypeRequestDTO>({
      method: "put",
      path: `/metrica/tipo/${id}`,
      data: payload,
    });
  },

  /**
   * Desabilita um tipo de métrica
   */
  disableById(id: string): Promise<void> {
    return apiRequest<void>({
      method: "delete",
      path: `/metrica/tipo/${id}`,
    });
  },
};
