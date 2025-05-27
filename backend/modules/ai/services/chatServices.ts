import { apiRequestStream } from "@/backend/api";

export const chatService = {
   askGroq(prompt: string): Promise<ReadableStream<Uint8Array>> {
      return apiRequestStream({
         method: "POST",
         path: "/chat/ask",
         data: prompt,
      });
   },
};
