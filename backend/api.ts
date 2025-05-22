import axios, { AxiosRequestConfig, Method } from "axios";
import Cookies from "js-cookie";

export interface ApiRequestOptions<Req = any> {
   method: Method;
   path: string;
   data?: Req;
   params?: Record<string, any>;
   baseUrl?: string;
   headers?: Record<string, string>;
}

export async function apiRequest<Res, Req = any>(
   opts: ApiRequestOptions<Req>
): Promise<Res> {
   const {
      method,
      path,
      data,
      params,
      headers,
      baseUrl = process.env.NEXT_PUBLIC_API_URL,
   } = opts;
   const token = Cookies.get("token");
   const userId = Cookies.get("userId");

   const config: AxiosRequestConfig = {
      baseURL: baseUrl,
      url: path,
      method,
      headers: {
         "Content-Type": "application/json",
         ...(token ? { Authorization: `Bearer ${token}` } : {}),
         ...(userId ? { "X-User-Id": userId } : {}),
         ...headers,
      },
      data,
      params,
   };

   try {
      const response = await axios.request<Res>(config);
      return response.data;
   } catch (error: any) {
      // Se for um erro do Axios, extraímos o payload ApiError
      if (axios.isAxiosError(error) && error.response?.data) {
         const apiError = error.response.data as {
            timestamp?: string;
            code?: number;
            status?: string;
            errors?: string[];
         };

         // Monta mensagem única a partir da lista de erros
         const message = Array.isArray(apiError.errors)
            ? apiError.errors.join(", ")
            : apiError.status || "Erro desconhecido";

         throw new Error(message);
      }
      // Qualquer outro erro
      throw error;
   }
}
