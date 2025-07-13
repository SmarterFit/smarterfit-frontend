import type {
  CreateClassGroupRequestDTO,
  ClassGroupResponseDTO,
} from "@/backend/modules/classgroup/types/classGroupTypes";
import { apiRequest } from "@/backend/api";

export const ClassGroupService = {
  /**
   * Cria um novo grupo de aula
   */
  create(payload: CreateClassGroupRequestDTO): Promise<ClassGroupResponseDTO> {
    return apiRequest<ClassGroupResponseDTO, CreateClassGroupRequestDTO>({
      method: "post",
      path: "/turma/cadastrar",
      data: payload,
    });
  },

  /**
   * Busca grupo de aula por ID
   */
  getById(id: string): Promise<ClassGroupResponseDTO> {
    return apiRequest<ClassGroupResponseDTO>({
      method: "get",
      path: `/turma/${id}`,
    });
  },

  /**
   * Lista todos os grupos ativos
   */
  getAll(): Promise<ClassGroupResponseDTO[]> {
    return apiRequest<ClassGroupResponseDTO[]>({
      method: "get",
      path: "/turma",
    });
  },

  /**
   * Atualiza grupo de aula
   */
  update(id: string, payload: CreateClassGroupRequestDTO): Promise<ClassGroupResponseDTO> {
    return apiRequest<ClassGroupResponseDTO, CreateClassGroupRequestDTO>({
      method: "put",
      path: `/turma/${id}`,
      data: payload,
    });
  },

  /**
   * Remove (desativa) grupo de aula
   */
  delete(id: string): Promise<void> {
    return apiRequest<void>({
      method: "delete",
      path: `/turma/${id}`,
    });
  },
};
