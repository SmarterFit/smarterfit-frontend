"use client";

import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
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
import { Edit3, Loader2 } from "lucide-react";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import {
   updateUserEmailSchema,
   UpdateUserEmailRequestDTO,
} from "@/backend/modules/useraccess/schemas/userSchemas";
import { userService } from "@/backend/modules/useraccess/services/userServices";
import { ErrorToast, SuccessToast } from "../toasts/Toasts"; 
import { RoleLabels } from "@/backend/common/enums/rolesEnum";

interface UserSettingsProps {
   user?: UserResponseDTO | null;
   isLoading?: boolean;
   onUserEmailUpdated?: (updatedUser: UserResponseDTO) => void;
}

export function UserSettings({
   user,
   isLoading: propsIsLoading,
   onUserEmailUpdated,
}: UserSettingsProps) {
   const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
   const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

   const emailForm = useForm<UpdateUserEmailRequestDTO>({
      resolver: zodResolver(updateUserEmailSchema),
      mode: "onChange",
      defaultValues: { email: "" },
   });

   useEffect(() => {
      const storedAvatar = localStorage.getItem("userAvatar");
      if (storedAvatar) setAvatarUrl(storedAvatar);
   }, []);

   useEffect(() => {
      if (user?.email) {
         emailForm.reset({ email: user.email });
      }
   }, [user?.email, emailForm.reset, isEmailDialogOpen]);

   const onAvatarClick = () => fileInputRef.current?.click();

   const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
         const result = reader.result as string;
         setAvatarUrl(result);
         localStorage.setItem("userAvatar", result);
      };
      reader.readAsDataURL(file);
      if (e.target) e.target.value = "";
   };

   const onEmailSubmit = async (data: UpdateUserEmailRequestDTO) => {
      if (!user) return;
      setIsSubmittingEmail(true);
      try {
         const updatedUser = await userService.updateEmailById(user.id, data);
         SuccessToast(
            "E-mail atualizado!",
            "Seu endereço de e-mail foi alterado com sucesso."
         );
         if (onUserEmailUpdated) {
            onUserEmailUpdated(updatedUser);
         } else {
            localStorage.setItem("user", JSON.stringify(updatedUser));
         }
         emailForm.reset({ email: updatedUser.email });
         setIsEmailDialogOpen(false);
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setIsSubmittingEmail(false);
      }
   };

   if (propsIsLoading || !user) {
      return (
         <div className="flex items-center justify-between space-x-4 p-6 border-b">
            <div className="flex items-center space-x-4">
               <Skeleton className="h-20 w-20 rounded-full" />
               <div className="space-y-2">
                  <Skeleton className="h-6 w-[200px]" />
                  <Skeleton className="h-4 w-[180px]" />
                  <Skeleton className="h-4 w-[150px]" />
               </div>
            </div>
            <Skeleton className="h-10 w-32 rounded-md" />{" "}
            {/* Botão Editar Email */}
         </div>
      );
   }

   const { email, roles, profile } = user;
   const fullName = profile?.fullName;
   const nameInitial = fullName ? fullName.charAt(0).toUpperCase() : "?";

   return (
      <div className="flex items-center justify-between space-x-4 p-6">
         <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={onFileChange}
         />
         <div className="flex items-center space-x-4">
            <Avatar
               className="h-20 w-20 text-2xl cursor-pointer hover:opacity-80 transition-opacity"
               onClick={onAvatarClick}
            >
               {avatarUrl ? (
                  <AvatarImage
                     src={avatarUrl}
                     alt={fullName || "Avatar"}
                     className="object-cover"
                  />
               ) : (
                  <AvatarFallback>{nameInitial}</AvatarFallback>
               )}
            </Avatar>
            <div className="flex-1">
               <h1 className="text-2xl font-semibold">
                  {fullName || "Nome não informado"}
               </h1>
               <p className="text-sm text-muted-foreground">{email}</p>
               {roles?.length ? (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                     {roles.map((role) => (
                        <Badge
                           key={role}
                           variant="outline"
                           className="px-2 py-1 text-xs" // Adicionado text-xs para consistência
                        >
                           {/* Verifica se a role existe no RoleLabels antes de tentar acessá-la */}
                           {RoleLabels[role as keyof typeof RoleLabels] || role}
                        </Badge>
                     ))}
                  </div>
               ) : null}
            </div>
         </div>

         <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
            <DialogTrigger asChild>
               <Button variant="outline" className="cursor-pointer">
                  <Edit3 className="h-4 w-4 mr-2" /> Editar E-mail
               </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
               <DialogHeader>
                  <DialogTitle>Alterar E-mail</DialogTitle>
                  <DialogDescription>
                     Insira seu novo endereço de e-mail.
                  </DialogDescription>
               </DialogHeader>
               <Form {...emailForm}>
                  <form
                     onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                     className="space-y-4 pt-2"
                  >
                     <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Novo E-mail</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="seu.novo.email@exemplo.com"
                                    {...field}
                                    className={clsx(
                                       emailForm.formState.touchedFields
                                          .email &&
                                          (emailForm.formState.errors.email
                                             ? "border-red-500 focus-visible:ring-red-400"
                                             : "border-green-500 focus-visible:ring-green-400")
                                    )}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <div className="flex justify-end space-x-3 pt-2">
                        <Button
                           type="button"
                           variant="outline"
                           onClick={() => setIsEmailDialogOpen(false)}
                           disabled={isSubmittingEmail}
                        >
                           Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmittingEmail}>
                           {isSubmittingEmail && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           )}
                           Salvar Alterações
                        </Button>
                     </div>
                  </form>
               </Form>
            </DialogContent>
         </Dialog>
      </div>
   );
}
