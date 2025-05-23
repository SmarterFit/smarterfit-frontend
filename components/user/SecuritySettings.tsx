"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogTrigger,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import {
   UpdateUserPasswordRequestDTO,
   updateUserPasswordSchema,
} from "@/backend/modules/useraccess/schemas/userSchemas";
import { userService } from "@/backend/modules/useraccess/services/userServices";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";

interface SecuritySettingsProps {
   user?: UserResponseDTO | null;
   isLoading?: boolean;
}

export function SecuritySettings({
   user,
   isLoading: propsIsLoading,
}: SecuritySettingsProps) {
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const form = useForm<UpdateUserPasswordRequestDTO>({
      resolver: zodResolver(updateUserPasswordSchema),
      mode: "onChange",
      defaultValues: {
         currentPassword: "",
         newPassword: "",
         confirmNewPassword: "",
      },
   });
   const {
      control,
      handleSubmit,
      formState: { errors, touchedFields },
   } = form;

   if (propsIsLoading || (!user && propsIsLoading !== false)) {
      return (
         <div className="p-6 border-b">
            <Skeleton className="h-6 w-[200px] mb-2" />
            <Skeleton className="h-4 w-full max-w-xl mb-4" />
            <Skeleton className="h-10 w-32 rounded cursor-pointer" />
         </div>
      );
   }

   if (!user) {
      return (
         <div className="p-6 border-b text-center text-muted-foreground">
            Informações de segurança não disponíveis.
         </div>
      );
   }

   const onSubmit = async (data: UpdateUserPasswordRequestDTO) => {
      setIsSubmitting(true);
      try {
         await userService.updatePasswordById(user.id, data);
         SuccessToast(
            "Senha atualizada com sucesso!",
            "Sua senha foi alterada."
         );
         setIsDialogOpen(false);
         form.reset();
      } catch (e: any) {
         ErrorToast(e.message || "Erro ao atualizar senha");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="p-6 flex justify-between items-center">
         <div>
            <h2 className="text-lg font-semibold mb-2">Segurança</h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-xl">
               Mantenha sua conta segura. Utilize senhas fortes, combinando
               letras, números e símbolos. Evite sequências óbvias ou
               informações pessoais.
            </p>
         </div>

         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
               <Button variant="outline" className="cursor-pointer">
                  Alterar Senha
               </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
               <DialogHeader>
                  <DialogTitle>Atualizar Senha</DialogTitle>
                  <DialogDescription>
                     Escolha uma senha forte (8-50 caracteres, incluindo
                     maiúsculas, minúsculas, números e símbolos).
                  </DialogDescription>
               </DialogHeader>
               <Form {...form}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                     <FormField
                        control={control}
                        name="currentPassword"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Senha Atual</FormLabel>
                              <FormControl>
                                 <Input
                                    type="password"
                                    placeholder="********"
                                    {...field}
                                    className={clsx(
                                       touchedFields.currentPassword &&
                                          (errors.currentPassword
                                             ? "border-red-500"
                                             : "border-green-500"),
                                       "cursor-pointer"
                                    )}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={control}
                        name="newPassword"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nova Senha</FormLabel>
                              <FormControl>
                                 <Input
                                    type="password"
                                    placeholder="********"
                                    {...field}
                                    className={clsx(
                                       touchedFields.newPassword &&
                                          (errors.newPassword
                                             ? "border-red-500"
                                             : "border-green-500"),
                                       "cursor-pointer"
                                    )}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={control}
                        name="confirmNewPassword"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Confirmar Senha</FormLabel>
                              <FormControl>
                                 <Input
                                    type="password"
                                    placeholder="********"
                                    {...field}
                                    className={clsx(
                                       touchedFields.confirmNewPassword &&
                                          (errors.confirmNewPassword
                                             ? "border-red-500"
                                             : "border-green-500"),
                                       "cursor-pointer"
                                    )}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <div className="flex justify-end space-x-2 pt-2">
                        <Button
                           type="button"
                           variant="outline"
                           onClick={() => setIsDialogOpen(false)}
                           disabled={isSubmitting}
                           className="cursor-pointer"
                        >
                           Cancelar
                        </Button>
                        <Button
                           type="submit"
                           disabled={isSubmitting}
                           className="cursor-pointer"
                        >
                           {isSubmitting && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           )}
                           Salvar
                        </Button>
                     </div>
                  </form>
               </Form>
            </DialogContent>
         </Dialog>
      </div>
   );
}
