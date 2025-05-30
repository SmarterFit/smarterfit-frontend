import type {
  CreateClassGroupScheduleRequestDTO,
  ClassGroupScheduleResponseDTO,
} from "@/backend/modules/classgroup/types/classGroupScheduleTypes";
import { apiRequest } from "@/backend/api";

export const ClassGroupScheduleService = {
  /**
   * Cria um novo horário para um grupo de aula.
   */
  create(payload: CreateClassGroupScheduleRequestDTO): Promise<ClassGroupScheduleResponseDTO> {
    return apiRequest<ClassGroupScheduleResponseDTO, CreateClassGroupScheduleRequestDTO>({
      method: "post",
      path: "/turma/horarios/cadastrar",
      data: payload,
    });
  },


    getByClassGroupId(classGroupId: string): Promise<ClassGroupScheduleResponseDTO[]> {
    return apiRequest<ClassGroupScheduleResponseDTO[]>({
        method: "get",
        path: `/turma/horarios/${classGroupId}`,
    });
   },

  /**
   * Atualiza um horário de grupo de aula.
   */
  update(id: string, payload: CreateClassGroupScheduleRequestDTO): Promise<ClassGroupScheduleResponseDTO> {
    return apiRequest<ClassGroupScheduleResponseDTO, CreateClassGroupScheduleRequestDTO>({
      method: "put",
      path: `/turma/horarios/alterar/${id}`,
      data: payload,
    });
  },

  /**
   * Remove (deleta) um horário de grupo de aula.
   */
  delete(id: string): Promise<void> {
    return apiRequest<void>({
      method: "delete",
      path: `/turma/horarios/${id}`,
    });
  },
};
