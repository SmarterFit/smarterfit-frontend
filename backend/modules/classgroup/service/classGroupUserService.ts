import { apiRequest } from "@/backend/api";
import { EmployeeClassGroupUserDTO, MemberClassGroupUserDTO } from "@/backend/modules/classgroup/types/classGroupUserType";
import type { ClassGroupResponseDTO } from "@/backend/modules/classgroup/types/classGroupTypes";
import type { ClassUsersResponseDTO } from "@/backend/modules/classgroup/types/classGroupUserType";


export const classGroupUserService = {
  /**
   * Cadastra um funcionário em uma turma
   */
  addEmployeeToClassGroup(
    payload: EmployeeClassGroupUserDTO,
  ): Promise<void> {
    return apiRequest<void, EmployeeClassGroupUserDTO>({
      method: "post",
      path: "/turma/professor/cadastrar",
      data: payload
    });
  },

  /**
   * Cadastra um aluno em uma turma
   */
  addMemberToClassGroup(
    payload: MemberClassGroupUserDTO
  ): Promise<void> {
    return apiRequest<void, MemberClassGroupUserDTO>({
      method: "post",
      path: "/turma/alunos/cadastrar",
      data: payload,
    });
  },


  /**
   * Busca alunos de uma turma
   */
  getStudentsByClassGroupId(
    classGroupId: string
  ): Promise<ClassUsersResponseDTO[]> {
    return apiRequest<ClassUsersResponseDTO[]>({
      method: "get",
      path: `/turma/${classGroupId}/alunos`,
    });
  },

  /**
   * Busca professores de uma turma
   */
  getTeachersByClassGroupId(
    classGroupId: string
  ): Promise<ClassUsersResponseDTO[]> {
    return apiRequest<ClassUsersResponseDTO[]>({
      method: "get",
      path: `/turma/${classGroupId}/professores`,
    });
  },

  /**
   * Busca turmas de um usuário
   */
  getClassGroupsByUserId(
    userId: string
  ): Promise<ClassGroupResponseDTO[]> {
    return apiRequest<ClassGroupResponseDTO[]>({
      method: "get",
      path: `/turma/usuarios/${userId}`,
    });
  },


  /**
   * Remove usuário de uma turma
   */
  removeUserFromClassGroup(
    classGroupId: string,
    userId: string
  ): Promise<void> {
    return apiRequest<void>({
      method: "delete",
      path: `/turma/${classGroupId}/usuarios/${userId}`,
    });
  },
};
