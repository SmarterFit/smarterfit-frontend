import { apiRequest } from "@/lib/apiRequest";

export type CreateAddressRequestDTO = {
   street: string;
   number: string;
   neighborhood: string;
   city: string;
   cep: string;
   state: string;
};

export type CreateProfileRequestDTO = {
   fullName: string;
   cpf: string;
   phone: string;
   birthDate: string; // Vamos usar string para o formato de data
   gender: "MALE" | "FEMALE" | "OTHER"; // Tipo de dado do gender, baseado no seu modelo
   addresses: CreateAddressRequestDTO;
};

// Tipos de DTOs
export type AddressResponseDTO = {
   street: string;
   number: string;
   neighborhood: string;
   city: string;
   cep: string;
   state: string;
};

export type ProfileResponseDTO = {
   id: string;
   fullName: string;
   cpf: string;
   phone: string;
   birthDate: string; // Tipo de dado para a data
   gender: "MALE" | "FEMALE" | "OTHER"; // Gênero conforme as opções
   address: AddressResponseDTO;
};

// Função para buscar o perfil
export async function getProfileById(id: string): Promise<ProfileResponseDTO> {
   return await apiRequest<ProfileResponseDTO>("GET", `/perfis/${id}`);
}

// Função para atualizar o perfil
export async function updateProfile(
   id: string,
   data: CreateProfileRequestDTO
): Promise<ProfileResponseDTO> {
   return await apiRequest<ProfileResponseDTO>("PUT", `/perfis/${id}`, data);
}
