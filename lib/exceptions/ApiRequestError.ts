import { ApiError } from "@/lib/apiRequest";

export class ApiRequestError extends Error {
   public apiError: ApiError;

   constructor(apiError: ApiError) {
      super(apiError.errors.join(", ") || "Erro desconhecido.");
      this.apiError = apiError;

      Object.setPrototypeOf(this, ApiRequestError.prototype);
   }
}
