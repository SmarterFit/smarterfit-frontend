import { apiRequest } from "@/backend/api";
import { EmployeeSchedulerRequestDTO } from "../schemas/employeeScheduleSchemas";
import { EmployeeScheduleResponseDTO } from "../types/exployeeScheduleTypes";

export const employeeSchedulerService = {
   /**
    * Cria um novo agendamento para um funcionário.
    * Corresponde ao endpoint POST /funcionarios/horarios/cadastrar
    * @param requestDTO O corpo da requisição com os dados do agendamento.
    */
   createEmployeeSchedule(
      requestDTO: EmployeeSchedulerRequestDTO
   ): Promise<EmployeeScheduleResponseDTO> {
      return apiRequest<
         EmployeeScheduleResponseDTO,
         EmployeeSchedulerRequestDTO
      >({
         method: "post",
         path: `/funcionarios/horarios/cadastrar`,
         data: requestDTO,
      });
   },

   /**
    * Busca todos os agendamentos de um funcionário pelo ID do usuário.
    * Corresponde ao endpoint GET /funcionarios/horarios/{userId}
    * @param userId O ID do usuário para buscar os agendamentos.
    */
   getAllEmployeeScheduleByUserId(
      userId: string
   ): Promise<EmployeeScheduleResponseDTO[]> {
      return apiRequest<EmployeeScheduleResponseDTO[]>({
         method: "get",
         path: `/funcionarios/horarios/${userId}`,
      });
   },

   /**
    * Atualiza um agendamento existente pelo seu ID.
    * Corresponde ao endpoint PUT /funcionarios/horarios/{id}
    * @param id O ID do agendamento a ser atualizado.
    * @param requestDTO O corpo da requisição com os novos dados do agendamento.
    */
   updateEmployeeScheduleById(
      id: string,
      requestDTO: EmployeeSchedulerRequestDTO
   ): Promise<EmployeeScheduleResponseDTO> {
      return apiRequest<
         EmployeeScheduleResponseDTO,
         EmployeeSchedulerRequestDTO
      >({
         method: "put",
         path: `/funcionarios/horarios/${id}`,
         data: requestDTO,
      });
   },

   /**
    * Deleta um agendamento pelo seu ID.
    * Corresponde ao endpoint DELETE /funcionarios/horarios/{id}
    * @param id O ID do agendamento a ser deletado.
    */
   deleteEmployeeScheduleById(id: string): Promise<void> {
      return apiRequest<void>({
         method: "delete",
         path: `/funcionarios/horarios/${id}`,
      });
   },
};
