import { z } from "zod";
import { SubscriptionStatus } from "@/backend/common/enums/subscriptionStatusEnum"; // ajuste conforme a organização

// CreateSubscriptionRequestDTO
export const createSubscriptionRequestSchema = z.object({
   ownerId: z
      .string({ required_error: "O ID do proprietário não pode ser nulo" })
      .uuid({ message: "O ID do proprietário deve ser um UUID válido" }),
   planId: z
      .string({ required_error: "O ID do plano não pode ser nulo" })
      .uuid({ message: "O ID do plano deve ser um UUID válido" }),
   addOwnerAsParticipant: z.boolean().optional(),
});

export type CreateSubscriptionRequestDTO = z.infer<
   typeof createSubscriptionRequestSchema
>;

// SearchSubscriptionRequestDTO
export const searchSubscriptionRequestSchema = z.object({
   ownerId: z
      .string()
      .uuid({ message: "O ID do proprietário deve ser um UUID válido" })
      .optional(),
   participantId: z
      .string()
      .uuid({ message: "O ID do participante deve ser um UUID válido" })
      .optional(),
   planId: z
      .string()
      .uuid({ message: "O ID do plano deve ser um UUID válido" })
      .optional(),
   status: z
      .array(
         z.nativeEnum(SubscriptionStatus, {
            invalid_type_error:
               "O status deve ser um dos valores válidos de SubscriptionStatus",
         })
      )
      .optional(),
});

export type SearchSubscriptionRequestDTO = z.infer<
   typeof searchSubscriptionRequestSchema
>;

// SubscriptionStatusCountRequestDTO
export const subscriptionStatusCountRequestSchema = z.object({
   renewedFrom: z
      .string({ required_error: "O campo 'renewedFrom' não pode ser nulo" })
      .datetime({
         message: "O campo 'renewedFrom' deve ser uma data/hora válida",
      }),
   renewedTo: z
      .string({ required_error: "O campo 'renewedTo' não pode ser nulo" })
      .datetime({
         message: "O campo 'renewedTo' deve ser uma data/hora válida",
      }),

   createdFrom: z
      .string({ required_error: "O campo 'createdFrom' não pode ser nulo" })
      .datetime({
         message: "O campo 'createdFrom' deve ser uma data/hora válida",
      }),
   createdTo: z
      .string({ required_error: "O campo 'createdTo' não pode ser nulo" })
      .datetime({
         message: "O campo 'createdTo' deve ser uma data/hora válida",
      }),

   canceledFrom: z
      .string({ required_error: "O campo 'canceledFrom' não pode ser nulo" })
      .datetime({
         message: "O campo 'canceledFrom' deve ser uma data/hora válida",
      }),
   canceledTo: z
      .string({ required_error: "O campo 'canceledTo' não pode ser nulo" })
      .datetime({
         message: "O campo 'canceledTo' deve ser uma data/hora válida",
      }),

   pendingFrom: z
      .string({ required_error: "O campo 'pendingFrom' não pode ser nulo" })
      .datetime({
         message: "O campo 'pendingFrom' deve ser uma data/hora válida",
      }),
   pendingTo: z
      .string({ required_error: "O campo 'pendingTo' não pode ser nulo" })
      .datetime({
         message: "O campo 'pendingTo' deve ser uma data/hora válida",
      }),

   expiredFrom: z
      .string({ required_error: "O campo 'expiredFrom' não pode ser nulo" })
      .datetime({
         message: "O campo 'expiredFrom' deve ser uma data/hora válida",
      }),
   expiredTo: z
      .string({ required_error: "O campo 'expiredTo' não pode ser nulo" })
      .datetime({
         message: "O campo 'expiredTo' deve ser uma data/hora válida",
      }),
});

export type SubscriptionStatusCountRequestDTO = z.infer<
   typeof subscriptionStatusCountRequestSchema
>;
