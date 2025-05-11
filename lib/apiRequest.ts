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
   config?: AxiosRequestConfig,
   requireLogin: boolean = false
): Promise<T> {
   try {
      if (requireLogin) {
         const tokenType = localStorage.getItem("tokenType");
         const token = localStorage.getItem("token");
         const user = localStorage.getItem("user");

         if (!token || !tokenType || !user) {
            throw new Error("Usuário não autenticado. Favor fazer login.");
         }

         const parsedUser = JSON.parse(user);
         const userId = parsedUser.id;

         if (!config) {
            config = {};
         }

         config.headers = {
            ...config.headers,
            Authorization: `${tokenType} ${token}`,
            "X-User-Id": userId,
         };
      }

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
