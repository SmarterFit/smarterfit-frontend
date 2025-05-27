import { apiRequest } from "@/backend/api";
import { CreateEquipmentRequestDTO } from "../schemas/equipmentSchemas";
import { EquipmentResponseDTO } from "../types/equipmentTypes";
import { PageResponseDTO } from "@/backend/common/types/pageTypes";

/**
 * Service para chamadas à API de equipamentos
 */
export const equipmentService = {
   /**
    * Cria um novo equipamento
    */
   create(payload: CreateEquipmentRequestDTO): Promise<EquipmentResponseDTO> {
      return apiRequest<EquipmentResponseDTO, CreateEquipmentRequestDTO>({
         method: "post",
         path: `/equipamentos/cadastrar`,
         data: payload,
      });
   },

   /**
    * Obtém um equipamento pelo ID
    */
   getById(id: string): Promise<EquipmentResponseDTO> {
      return apiRequest<EquipmentResponseDTO>({
         method: "get",
         path: `/equipamentos/${id}`,
      });
   },

   /**
    * Busca todos os equipamentos pelo nome
    */
   getAllByName(name: string): Promise<EquipmentResponseDTO[]> {
      return apiRequest<EquipmentResponseDTO[]>({
         method: "get",
         path: `/equipamentos/buscar/${name}`,
      });
   },

   /**
    * Obtém todos os equipamentos com paginação
    */
   getAll(
      page?: number,
      size?: number
   ): Promise<PageResponseDTO<EquipmentResponseDTO>> {
      return apiRequest<PageResponseDTO<EquipmentResponseDTO>>({
         method: "get",
         path: `/equipamentos`,
         params: {
            page,
            size,
         },
      });
   },

   /**
    * Atualiza um equipamento pelo ID
    */
   updateById(
      id: string,
      payload: CreateEquipmentRequestDTO
   ): Promise<EquipmentResponseDTO> {
      return apiRequest<EquipmentResponseDTO, CreateEquipmentRequestDTO>({
         method: "put",
         path: `/equipamentos/${id}`,
         data: payload,
      });
   },

   /**
    * Exclui um equipamento pelo ID
    */
   deleteById(id: string): Promise<void> {
      return apiRequest<void>({
         method: "delete",
         path: `/equipamentos/${id}`,
      });
   },
};
