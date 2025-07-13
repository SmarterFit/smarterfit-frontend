import type {
  CreateClassSessionRequestDTO,
  UpdateClassSessionRequestDTO,
  ClassSessionResponseDTO,
} from "@/backend/modules/classgroup/types/classGroupSessionTypes";
import { apiRequest } from "@/backend/api";

export const ClassSessionService = {
  /**
   * Cria uma nova aula (sessão de turma)
   */
  create(payload: CreateClassSessionRequestDTO): Promise<ClassSessionResponseDTO> {
    return apiRequest<ClassSessionResponseDTO, CreateClassSessionRequestDTO>({
      method: "post",
      path: "/turma/aula/cadastrar",
      data: payload,
    });
  },

  /**
   * Busca uma aula por ID
   */
  getById(id: string): Promise<ClassSessionResponseDTO> {
    return apiRequest<ClassSessionResponseDTO>({
      method: "get",
      path: `/turma/aula/${id}`,
    });
  },

  /**
   * Lista todas as aulas agendadas de uma turma
   */
  getAllByClassGroupId(classGroupId: string): Promise<ClassSessionResponseDTO[]> {
    return apiRequest<ClassSessionResponseDTO[]>({
      method: "get",
      path: `/turma/aula/agendada/${classGroupId}`,
    });
  },

  /**
   * Atualiza uma aula por ID
   */
  update(id: string, payload: UpdateClassSessionRequestDTO): Promise<ClassSessionResponseDTO> {
    return apiRequest<ClassSessionResponseDTO, UpdateClassSessionRequestDTO>({
      method: "put",
      path: `/turma/aula/alterar/${id}`,
      data: payload,
    });
  },

  /**
   * Deleta uma aula por ID
   */
  delete(id: string): Promise<void> {
    return apiRequest<void>({
      method: "delete",
      path: `/turma/aula/${id}`,
    });
  },

  /**
   * Aciona o agendamento automático de aulas
   */
  schedule(): Promise<void> {
    return apiRequest<void>({
      method: "post",
      path: "/turma/aula/agendar",
    });
  },
};
