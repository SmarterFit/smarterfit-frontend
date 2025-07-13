import axios, { AxiosRequestConfig, Method, AxiosResponse } from "axios";
import qs from "qs";
import Cookies from "js-cookie";

export interface ApiRequestOptions<Req = any> {
   method: Method;
   path: string;
   data?: Req;
   params?: Record<string, any>;
   baseUrl?: string;
   headers?: Record<string, string>;
}

export interface ApiRequestStreamOptions<Req = any> {
   method: Method;
   path: string;
   data?: Req;
   params?: Record<string, any>;
   baseUrl?: string;
   headers?: Record<string, string>;
}
/**
 * Função padrão para requisições normais (não stream) - VERSÃO CORRIGIDA
 */
export async function apiRequest<Res, Req = any>(
    opts: ApiRequestOptions<Req>
): Promise<Res | AxiosResponse["data"]> {
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

    const customHeaders: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(userId ? { "X-User-Id": userId } : {}),
        ...headers,
    };

    if (!(data instanceof FormData)) {
        customHeaders["Content-Type"] = "application/json";
    }


    const config: AxiosRequestConfig = {
        baseURL: baseUrl,
        url: path,
        method,
        headers: customHeaders, // Usamos os cabeçalhos montados dinamicamente
        data,
        params,
        paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat", skipNulls: true }),
        responseType: "json",
    };

    try {
        const response = await axios.request(config);
        return response.data as Res;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.data) {
            const apiError = error.response.data as {
                timestamp?: string;
                code?: number;
                status?: string;
                errors?: string[];
            };

            const message = Array.isArray(apiError.errors)
                ? apiError.errors.join(", ")
                : apiError.status || "Erro desconhecido";

            throw new Error(message);
        }
        throw error;
    }
}

/**
 * Função para requisições que precisam de resposta em stream (ReadableStream)
 */
export async function apiRequestStream(
   opts: ApiRequestStreamOptions
): Promise<ReadableStream<Uint8Array>> {
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

   const url = new URL(path, baseUrl);

   if (params) {
      // serializa arrays repetindo chave sem colchetes
      Object.entries(params).forEach(([key, value]) => {
         if (Array.isArray(value)) {
            value.forEach((v) => url.searchParams.append(key, String(v)));
         } else if (value != null) {
            url.searchParams.append(key, String(value));
         }
      });
   }

   const response = await fetch(url.toString(), {
      method,
      headers: {
         "Content-Type": "application/json",
         ...(token ? { Authorization: `Bearer ${token}` } : {}),
         ...(userId ? { "X-User-Id": userId } : {}),
         ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
   });

   if (!response.ok) {
      let errorMsg = `Erro: ${response.statusText}`;
      try {
         const errorData = await response.json();
         if (errorData.errors) {
            errorMsg = errorData.errors.join(", ");
         } else if (errorData.status) {
            errorMsg = errorData.status;
         }
      } catch {
         // ignora erro na tentativa de parse do json de erro
      }
      throw new Error(errorMsg);
   }

   if (!response.body) {
      throw new Error("Resposta não contém stream");
   }

   return response.body;
}
