// services/apiRequest.ts
import axios, { AxiosRequestConfig, Method } from "axios";

const API_BASE_URL = "http://localhost:8081";

export type ApiError = {
   timestamp: string;
   code: number;
   status: string;
   errors: string[];
};

export async function apiRequest<T>(
   method: Method,
   url: string,
   data?: unknown,
   config?: AxiosRequestConfig
): Promise<T> {
   try {
      const response = await axios.request<T>({
         method,
         url: `${API_BASE_URL}${url}`,
         data,
         ...config,
      });

      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error)) {
         const errData = error.response?.data as ApiError;
         const message = errData?.errors?.join(", ") || "Erro desconhecido.";
         throw new Error(message);
      }

      throw new Error("Erro inesperado de rede.");
   }
}
