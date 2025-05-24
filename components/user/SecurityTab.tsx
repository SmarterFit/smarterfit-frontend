import {
   UpdateUserPasswordRequestDTO,
   updateUserPasswordSchema,
} from "@/backend/modules/useraccess/schemas/userSchemas";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";
import { userService } from "@/backend/modules/useraccess/services/userServices";
import { KeyRound, Loader2 } from "lucide-react";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface SecurityTabProps {
   user?: UserResponseDTO | null;
   isLoading?: boolean;
}

export function SecurityTab({ user, isLoading }: SecurityTabProps) {
   const [submittingPassword, setSubmittingPassword] = useState(false);

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
      reset,
   } = form;

   const handlePasswordSubmit = async (data: UpdateUserPasswordRequestDTO) => {
      if (!user) return;
      setSubmittingPassword(true);
      try {
         await userService.updatePasswordById(user.id, data);
         SuccessToast(
            "Senha atualizada com sucesso!",
            "Sua senha foi alterada."
         );
         reset({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
         });
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setSubmittingPassword(false);
      }
   };

   if (isLoading || !user) {
      return (
         <div className="space-y-8">
            <section className="flex flex-col space-y-4 p-6 border rounded-lg">
               <Skeleton className="h-8 w-1/3" />
               <Skeleton className="h-4 w-2/3" />
               <Skeleton className="h-10 w-full" />
               <Skeleton className="h-10 w-full" />
               <Skeleton className="h-10 w-full" />
               <Skeleton className="h-10 w-32" />
            </section>
         </div>
      );
   }

   return (
      <div className="space-y-8">
         <section className="flex flex-col space-y-6 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold flex items-center">
               Segurança
               <KeyRound className="ml-2 h-5 w-5 text-muted-foreground" />
            </h2>
            <p className="text-muted-foreground text-sm">
               Atualize sua senha regularmente para manter sua conta segura.
            </p>

            <Form {...form}>
               <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  onSubmit={handleSubmit(handlePasswordSubmit)}
               >
                  <FormField
                     control={control}
                     name="currentPassword"
                     render={({ field }) => (
                        <FormItem className="col-span-2">
                           <FormLabel>Senha Atual</FormLabel>
                           <FormControl>
                              <Input
                                 type="password"
                                 {...field}
                                 className={
                                    touchedFields.currentPassword
                                       ? errors.currentPassword
                                          ? "border-destructive focus-visible:ring-destructive"
                                          : "border-green-500 focus-visible:ring-green-500"
                                       : ""
                                 }
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
                                 {...field}
                                 className={
                                    touchedFields.newPassword
                                       ? errors.newPassword
                                          ? "border-destructive focus-visible:ring-destructive"
                                          : "border-green-500 focus-visible:ring-green-500"
                                       : ""
                                 }
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
                           <FormLabel>Confirmar Nova Senha</FormLabel>
                           <FormControl>
                              <Input
                                 type="password"
                                 {...field}
                                 className={
                                    touchedFields.confirmNewPassword
                                       ? errors.confirmNewPassword
                                          ? "border-destructive focus-visible:ring-destructive"
                                          : "border-green-500 focus-visible:ring-green-500"
                                       : ""
                                 }
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <div className="md:col-span-2 flex justify-end">
                     <Button type="submit" disabled={submittingPassword}>
                        {submittingPassword && (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Atualizar Senha
                     </Button>
                  </div>
               </form>
            </Form>
         </section>
      </div>
   );
}
