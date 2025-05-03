import axios, { AxiosRequestConfig, Method } from "axios";
import { ApiRequestError } from "./exceptions/ApiRequestError";

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
         throw new ApiRequestError(errData);
      }

      throw new Error("Erro inesperado de rede.");
   }
}
