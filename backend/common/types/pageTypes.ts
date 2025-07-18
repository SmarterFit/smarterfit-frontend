export interface PageResponseDTO<T> {
   content: T[];
   totalElements: number;
   totalPages: number;
   page: number;
   size: number;
}
