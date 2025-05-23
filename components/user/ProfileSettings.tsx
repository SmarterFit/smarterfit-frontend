"use client";

import React, { useEffect, useState } from "react";
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
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
   Popover,
   PopoverTrigger,
   PopoverContent,
} from "@/components/ui/popover"; // Para o Date Picker
import { Calendar } from "@/components/ui/calendar"; // Para o Date Picker
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   Loader2,
   UserCircle,
   CalendarDays as CalendarIcon, // Renomeado para evitar conflito
   Phone as PhoneIcon,
   Users,
   FileTextIcon,
   Edit,
   User, // Ícone para o botão de editar
} from "lucide-react";
import {
   updateProfileSchema,
   UpdateProfileRequestDTO,
} from "@/backend/modules/useraccess/schemas/profileSchemas";
import { ErrorToast, SuccessToast } from "../toasts/Toasts"; // Ajuste o caminho
import { ProfileResponseDTO } from "@/backend/modules/useraccess/types/profileTypes";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Gender, GenderLabels } from "@/backend/common/enums/genderEnum";
import { profileService } from "@/backend/modules/useraccess/services/profileServices";
import { withMask } from "use-mask-input";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ProfileSettingsProps {
   profile?: ProfileResponseDTO | null;
   isLoading?: boolean;
   onProfileUpdated?: (updatedProfile: ProfileResponseDTO) => void;
}

// Função para converter string YYYY-MM-DD para Date
const parseDateString = (dateStr?: string): Date | undefined => {
   if (!dateStr) return undefined;
   try {
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
         const [year, month, day] = dateStr.split("-").map(Number);
         return new Date(year, month - 1, day); // Mês é 0-indexado
      }
      return parseISO(dateStr); // Para formatos ISO completos
   } catch {
      return undefined;
   }
};

export function ProfileSettings({
   profile,
   isLoading,
   onProfileUpdated,
}: ProfileSettingsProps) {
   const [open, setOpen] = useState(false);
   const [submitting, setSubmitting] = useState(false);

   const form = useForm<UpdateProfileRequestDTO>({
      // Usando o tipo interno para o formulário
      resolver: zodResolver(updateProfileSchema), // Zod schema ainda espera string para birthDate na validação
      mode: "onChange",
      defaultValues: {
         fullName: profile?.fullName || "",
         cpf: profile?.cpf || "",
         phone: profile?.phone || "",
         birthDate: profile?.birthDate
            ? parseDateString(profile.birthDate)
            : undefined,
         gender: profile?.gender || undefined,
      },
   });

   const {
      control,
      handleSubmit,
      formState: { errors, touchedFields },
      reset,
   } = form;

   useEffect(() => {
      if (profile) {
         reset({
            fullName: profile.fullName,
            cpf: profile.cpf,
            phone: profile.phone || "",
            birthDate: profile.birthDate
               ? parseDateString(profile.birthDate)
               : undefined,
            gender: profile.gender,
         });
      } else {
         // Se o perfil for null (ex: logout), limpa o formulário
         reset({
            fullName: "",
            cpf: "",
            phone: "",
            birthDate: undefined,
            gender: undefined,
         });
      }
   }, [profile, reset]);

   const calculateAge = (birthDateStr?: string): number | null => {
      const birthDateObj = parseDateString(birthDateStr);
      if (!birthDateObj) return null;

      const today = new Date();
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDifference = today.getMonth() - birthDateObj.getMonth();
      if (
         monthDifference < 0 ||
         (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
      ) {
         age--;
      }
      return age >= 0 ? age : null;
   };

   const onSubmit = async (formData: UpdateProfileRequestDTO) => {
      if (!profile) return;

      setSubmitting(true);
      try {
         const updatedProfileData = await profileService.updateById(
            profile.id,
            formData
         );
         SuccessToast(
            "Perfil atualizado",
            "Seus dados foram salvos com sucesso."
         );
         if (onProfileUpdated) {
            onProfileUpdated(updatedProfileData);
         }
         setOpen(false);
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setSubmitting(false);
      }
   };

   if (isLoading) {
      return (
         <div className="p-6 border rounded-lg shadow-sm animate-pulse">
            <div className="flex justify-between items-start mb-6">
               <div className="w-3/4 space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-1/4" />
               </div>
               <Skeleton className="h-10 w-24" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
               {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-1">
                     <Skeleton className="h-4 w-1/3" />
                     <Skeleton className="h-5 w-2/3" />
                  </div>
               ))}
            </div>
         </div>
      );
   }

   if (!profile) {
      return (
         <div className="p-6 border rounded-lg shadow-sm text-center text-muted-foreground">
            Informações do perfil não disponíveis.
         </div>
      );
   }

   const age = calculateAge(profile.birthDate);
   const formattedBirthDateForDisplay = profile.birthDate
      ? format(parseDateString(profile.birthDate) || new Date(), "dd/MM/yyyy", {
           locale: ptBR,
        })
      : "Não informada";
   const genderLabel = profile.gender
      ? GenderLabels[profile.gender]
      : "Não informado";

   return (
      <div className="p-6">
         <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-2 flex-1">
               <h2 className="text-2xl font-semibold text-foreground flex items-center">
                  <User className="mr-2" />
                  Dados Pessoais
               </h2>

               <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 px-1">
                  <div>
                     <p className="text-xs font-medium text-muted-foreground">
                        CPF
                     </p>
                     <p className="text-sm text-foreground flex items-center">
                        <FileTextIcon className="h-4 w-4 mr-2 opacity-70" />
                        {profile.cpf || "Não informado"}
                     </p>
                  </div>
                  <div>
                     <p className="text-xs font-medium text-muted-foreground">
                        Telefone
                     </p>
                     <p className="text-sm text-foreground flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-2 opacity-70" />
                        {profile.phone || "Não informado"}
                     </p>
                  </div>
                  <div>
                     <p className="text-xs font-medium text-muted-foreground">
                        Data de Nascimento
                     </p>
                     <p className="text-sm text-foreground flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 opacity-70" />
                        {formattedBirthDateForDisplay}
                        {age !== null && (
                           <p className="text-sm text-muted-foreground pl-2">
                              {age} anos
                           </p>
                        )}
                     </p>
                  </div>
                  <div>
                     <p className="text-xs font-medium text-muted-foreground">
                        Gênero
                     </p>
                     <p className="text-sm text-foreground flex items-center">
                        <Users className="h-4 w-4 mr-2 opacity-70" />
                        {genderLabel}
                     </p>
                  </div>
               </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger asChild>
                  <Button variant="outline" className="cursor-pointer">
                     <Edit className="h-4 w-4 mr-2" />
                     Editar Perfil
                  </Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                     <DialogTitle>Editar Dados Pessoais</DialogTitle>
                     <DialogDescription>
                        Mantenha seus dados sempre atualizados.
                     </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                     <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 pt-2 max-h-[70vh] overflow-y-auto pr-2"
                     >
                        {/* Nome Completo (ocupa a linha inteira) */}
                        <FormField
                           control={control}
                           name="fullName"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Nome Completo</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Seu nome completo"
                                       {...field}
                                       className={cn(
                                          touchedFields.fullName &&
                                             (errors.fullName
                                                ? "border-destructive focus-visible:ring-destructive"
                                                : "border-green-500 focus-visible:ring-green-500")
                                       )}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* CPF e Telefone lado a lado em telas médias e acima */}
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                           <FormField
                              control={control}
                              name="cpf"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>CPF</FormLabel>
                                    <FormControl>
                                       <Input
                                          placeholder="000.000.000-00"
                                          {...field}
                                          ref={withMask("999.999.999-99")}
                                          className={cn(
                                             touchedFields.cpf &&
                                                (errors.cpf
                                                   ? "border-destructive focus-visible:ring-destructive"
                                                   : "border-green-500 focus-visible:ring-green-500")
                                          )}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                           <FormField
                              control={control}
                              name="phone"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Telefone</FormLabel>
                                    <FormControl>
                                       <Input
                                          placeholder="(99) 99999-9999"
                                          {...field}
                                          ref={withMask([
                                             "(99) 9999-9999",
                                             "(99) 99999-9999",
                                          ])}
                                          className={cn(
                                             touchedFields.phone &&
                                                (errors.phone
                                                   ? "border-destructive focus-visible:ring-destructive"
                                                   : "border-green-500 focus-visible:ring-green-500")
                                          )}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>

                        {/* Data de Nascimento e Gênero lado a lado em telas médias e acima */}
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                           <FormField
                              control={control}
                              name="birthDate" // Este campo no RHF agora espera um objeto Date
                              render={({ field }) => (
                                 <FormItem className="flex flex-col pt-2">
                                    {" "}
                                    {/* pt-2 para alinhar FormLabel com outros */}
                                    <FormLabel>Data de Nascimento</FormLabel>
                                    <Popover>
                                       <PopoverTrigger asChild>
                                          <FormControl>
                                             <Button
                                                variant={"outline"}
                                                className={cn(
                                                   "w-full pl-3 text-left font-normal",
                                                   !field.value &&
                                                      "text-muted-foreground"
                                                )}
                                             >
                                                {field.value ? (
                                                   format(field.value, "PPP")
                                                ) : (
                                                   <span>Escolha uma data</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                             </Button>
                                          </FormControl>
                                       </PopoverTrigger>
                                       <PopoverContent
                                          className="w-auto p-0"
                                          align="start"
                                       >
                                          <Calendar
                                             mode="single"
                                             selected={field.value}
                                             onSelect={field.onChange}
                                             disabled={(date) =>
                                                date > new Date() ||
                                                date < new Date("1900-01-01")
                                             }
                                             disableNavigation
                                             captionLayout="dropdown"
                                             locale={ptBR}
                                          />
                                       </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                           <FormField
                              control={control}
                              name="gender"
                              render={({ field }) => (
                                 <FormItem className="pt-2">
                                    {" "}
                                    {/* pt-2 para alinhar FormLabel com outros */}
                                    <FormLabel>Gênero</FormLabel>
                                    <Select
                                       onValueChange={field.onChange}
                                       value={field.value || ""} // Garante que value não seja undefined
                                    >
                                       <FormControl className="w-full">
                                          <SelectTrigger
                                             className={cn(
                                                touchedFields.gender &&
                                                   (errors.gender
                                                      ? "border-destructive focus-visible:ring-destructive"
                                                      : "border-green-500 focus-visible:ring-green-500")
                                             )}
                                          >
                                             <SelectValue placeholder="Selecione o gênero" />
                                          </SelectTrigger>
                                       </FormControl>
                                       <SelectContent>
                                          <SelectGroup>
                                             <SelectLabel>Gêneros</SelectLabel>
                                             {Object.values(Gender).map(
                                                (genderValue) => (
                                                   <SelectItem
                                                      key={genderValue}
                                                      value={genderValue}
                                                   >
                                                      {
                                                         GenderLabels[
                                                            genderValue
                                                         ]
                                                      }
                                                   </SelectItem>
                                                )
                                             )}
                                          </SelectGroup>
                                       </SelectContent>
                                    </Select>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>

                        <div className="flex justify-end space-x-2 pt-3">
                           <Button
                              type="button"
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() => setOpen(false)} // Assumindo que setOpen vem do escopo do ProfileSettings
                              disabled={submitting} // Assumindo que submitting vem do escopo do ProfileSettings
                           >
                              Cancelar
                           </Button>
                           <Button
                              type="submit"
                              className="cursor-pointer"
                              disabled={submitting} // Assumindo que submitting vem do escopo do ProfileSettings
                           >
                              {submitting && ( // Assumindo que submitting vem do escopo do ProfileSettings
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
      </div>
   );
}
