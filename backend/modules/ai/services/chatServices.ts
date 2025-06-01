import { apiRequest, apiRequestStream } from "@/backend/api";
import { WorkoutPlanResponseDTO } from "../../training/types/workoutPlanTypes";

export const chatService = {
   askGroq(prompt: string): Promise<ReadableStream<Uint8Array>> {
      return apiRequestStream({
         method: "POST",
         path: "/chat/ask",
         data: prompt,
      });
   },

   askGroqTraining(): Promise<WorkoutPlanResponseDTO> {
      return apiRequest<WorkoutPlanResponseDTO>({
         method: "POST",
         path: "/chat/ask/training",
      });
   },
};
