import { apiRequest } from "@/lib/apiRequest";

export type RegisterUserData = {
   name: string;
   email: string;
   cpf: string;
   password: string;
   confirmPassword: string;
   roles: string[];
};

export type UserResponseDTO = {
   id: string;
   email: string;
   roles: string[];
};

export const roleOptions = [
   { label: "Administrador", value: "ADMIN" },
   { label: "Cliente", value: "CUSTOMER" },
   { label: "Funcionário", value: "EMPLOYEE" },
];

export async function registerUser(
   data: RegisterUserData
): Promise<UserResponseDTO> {
   return await apiRequest<UserResponseDTO>(
      "POST",
      "/usuarios/cadastrar",
      data
   );
}

export async function getUserById(id: string): Promise<UserResponseDTO> {
   return await apiRequest<UserResponseDTO>("GET", `/usuarios/${id}`);
}

export async function updateUserById(
   id: string,
   data: RegisterUserData
): Promise<UserResponseDTO> {
   return await apiRequest<UserResponseDTO>("PUT", `/usuarios/${id}`, data);
}

export async function deleteUserById(id: string): Promise<void> {
   await apiRequest<void>("DELETE", `/usuarios/${id}`);
}

export async function getAllUsers(): Promise<UserResponseDTO[]> {
   return await apiRequest<UserResponseDTO[]>("GET", "/usuarios");
}
