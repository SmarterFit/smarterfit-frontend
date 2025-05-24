import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
   Loader2,
   CalendarDays as CalendarIcon,
   Phone as PhoneIcon,
   FileText as FileTextIcon,
   Users,
   Edit,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectGroup,
   SelectLabel,
   SelectItem,
} from "@/components/ui/select";
import {
   Popover,
   PopoverTrigger,
   PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
   Form,
   FormField,
   FormItem,
   FormControl,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

import {
   updateUserEmailSchema,
   UpdateUserEmailRequestDTO,
} from "@/backend/modules/useraccess/schemas/userSchemas";
import {
   updateProfileSchema,
   UpdateProfileRequestDTO,
} from "@/backend/modules/useraccess/schemas/profileSchemas";
import { userService } from "@/backend/modules/useraccess/services/userServices";
import { profileService } from "@/backend/modules/useraccess/services/profileServices";
import { RoleLabels } from "@/backend/common/enums/rolesEnum";
import { GenderLabels } from "@/backend/common/enums/genderEnum";
import { withMask } from "use-mask-input";
import { SuccessToast, ErrorToast } from "../toasts/Toasts";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import { ProfileResponseDTO } from "@/backend/modules/useraccess/types/profileTypes";
import { cn } from "@/lib/utils";

interface ProfileTabProps {
   user?: UserResponseDTO | null;
   isLoading?: boolean;
   onUserUpdated?: (user: UserResponseDTO) => void;
   onProfileUpdated?: (profile: ProfileResponseDTO) => void;
}

export function ProfileTab({
   user,
   isLoading,
   onUserUpdated,
   onProfileUpdated,
}: ProfileTabProps) {
   const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [submittingEmail, setSubmittingEmail] = useState(false);
   const [submittingProfile, setSubmittingProfile] = useState(false);

   const userForm = useForm<UpdateUserEmailRequestDTO>({
      resolver: zodResolver(updateUserEmailSchema),
      mode: "onChange",
      defaultValues: { email: user?.email ?? "" },
   });

   const profileForm = useForm<UpdateProfileRequestDTO>({
      resolver: zodResolver(updateProfileSchema),
      mode: "onChange",
      defaultValues: {
         fullName: user?.profile?.fullName ?? "",
         cpf: user?.profile?.cpf ?? "",
         phone: user?.profile?.phone ?? "",
         birthDate: user?.profile?.birthDate
            ? parseISO(user.profile.birthDate)
            : undefined,
         gender: user?.profile?.gender ?? undefined,
      },
   });

   const {
      control: userControl,
      handleSubmit: userHandleSubmit,
      formState: { errors: userErrors, touchedFields: userTouched },
      reset: resetUser,
   } = userForm;

   const {
      control: profileControl,
      handleSubmit: profileHandleSubmit,
      formState: { errors: profileErrors, touchedFields: profileTouched },
      reset: resetProfile,
   } = profileForm;

   useEffect(() => {
      const stored = localStorage.getItem("userAvatar");
      if (stored) setAvatarUrl(stored);
   }, []);

   useEffect(() => {
      if (user?.email) userForm.reset({ email: user.email });
      if (user?.profile) {
         const p = user.profile;

         resetProfile({
            fullName: p.fullName,
            cpf: p.cpf,
            phone: p.phone ?? "",
            birthDate: p.birthDate ? parseISO(p.birthDate) : undefined,
            gender: p.gender ?? undefined,
         });
      }
   }, [user]);

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
      e.target.value = "";
   };

   const handleEmailSubmit = async (data: UpdateUserEmailRequestDTO) => {
      if (!user) return;
      setSubmittingEmail(true);
      try {
         const updated = await userService.updateEmailById(user.id, data);
         SuccessToast("E-mail atualizado!", "Seu e-mail foi alterado.");
         onUserUpdated?.(updated);
         resetUser({ email: updated.email });
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setSubmittingEmail(false);
      }
   };

   const handleProfileSubmit = async (data: UpdateProfileRequestDTO) => {
      if (!user?.profile) return;
      setSubmittingProfile(true);
      try {
         const updated = await profileService.updateById(user.id, data);
         SuccessToast("Perfil atualizado", "Seus dados foram salvos.");
         onProfileUpdated?.(updated);
         resetProfile({
            fullName: updated.fullName,
            cpf: updated.cpf,
            phone: updated.phone,
            birthDate: parseISO(updated.birthDate),
            gender: updated.gender ?? undefined,
         });
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setSubmittingProfile(false);
      }
   };

   if (isLoading || !user) {
      return (
         <div className="space-y-8 p-6">
            <section className="flex items-start space-x-6 p-6 border rounded-lg animate-pulse">
               <Skeleton className="h-20 w-20 rounded-full" />
               <div className="flex-1 space-y-4">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-2/4" />
                  <Skeleton className="h-4 w-1/4" />
               </div>
            </section>
            <section className="p-6 border rounded-lg space-y-4 animate-pulse">
               <Skeleton className="h-8 w-1/3" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-12 col-span-2" />
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
               </div>
            </section>
         </div>
      );
   }

   const age = user.profile.birthDate
      ? new Date().getFullYear() -
        parseISO(user.profile.birthDate).getFullYear()
      : null;

   return (
      <div className="space-y-8">
         <section className="flex items-start space-x-6 p-6 border rounded-lg">
            <input
               type="file"
               accept="image/*"
               className="hidden"
               ref={fileInputRef}
               onChange={onFileChange}
            />
            <Avatar
               className="h-20 w-20 cursor-pointer"
               onClick={onAvatarClick}
            >
               {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Avatar" />
               ) : (
                  <AvatarFallback>
                     {user.profile.fullName?.charAt(0).toUpperCase() ?? "?"}
                  </AvatarFallback>
               )}
            </Avatar>
            <div className="flex-1">
               <h2 className="text-2xl font-semibold mb-2">Perfil</h2>
               <Form {...userForm}>
                  <form
                     className="space-y-4"
                     onSubmit={userHandleSubmit(handleEmailSubmit)}
                  >
                     <FormField
                        control={userControl}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>E-mail</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="seu.email@exemplo.com"
                                    {...field}
                                    className={cn(
                                       userTouched.email &&
                                          (userErrors.email
                                             ? "border-destructive focus-visible:ring-destructive"
                                             : "border-green-500 focus-visible:ring-green-500")
                                    )}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <div className="flex items-center space-x-2">
                        <Button type="submit" disabled={submittingEmail}>
                           {submittingEmail && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           )}
                           Salvar E-mail
                        </Button>
                        <div className="flex flex-wrap gap-2">
                           {user.roles.map((role) => (
                              <Badge
                                 key={role}
                                 variant="outline"
                                 className="p-1"
                              >
                                 {RoleLabels[role] || role}
                              </Badge>
                           ))}
                        </div>
                     </div>
                  </form>
               </Form>
            </div>
         </section>
         <section className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
               Dados Pessoais
               <CalendarIcon className="ml-2 h-5 w-5 text-muted-foreground" />
               {age !== null && (
                  <span className="ml-auto text-sm text-muted-foreground">
                     {age} anos
                  </span>
               )}
            </h2>
            <Form {...profileForm}>
               <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  onSubmit={profileHandleSubmit(handleProfileSubmit)}
               >
                  <FormField
                     control={profileControl}
                     name="fullName"
                     render={({ field }) => (
                        <FormItem className="md:col-span-2">
                           <FormLabel>Nome Completo</FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 className={cn(
                                    profileTouched.fullName &&
                                       (profileErrors.fullName
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
                     control={profileControl}
                     name="cpf"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>CPF</FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 className={cn(
                                    profileTouched.cpf &&
                                       (profileErrors.cpf
                                          ? "border-destructive focus-visible:ring-destructive"
                                          : "border-green-500 focus-visible:ring-green-500")
                                 )}
                                 ref={withMask(["999.999.999-99"])}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={profileControl}
                     name="phone"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Telefone</FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 ref={withMask([
                                    "(99) 9999-9999",
                                    "(99) 99999-9999",
                                 ])}
                                 className={cn(
                                    profileTouched.phone &&
                                       (profileErrors.phone
                                          ? "border-destructive focus-visible:ring-destructive"
                                          : "border-green-500 focus-visible:ring-green-500")
                                 )}
                                 placeholder="(99) 99999-9999"
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={profileControl}
                     name="birthDate"
                     render={({ field }) => {
                        const selectedDate = field.value
                           ? new Date(field.value)
                           : new Date();
                        const [month, setMonth] = React.useState(
                           selectedDate.getMonth()
                        );
                        const [year, setYear] = React.useState(
                           selectedDate.getFullYear()
                        );

                        const handleMonthChange = (value: string) => {
                           const newMonth = parseInt(value);
                           setMonth(newMonth);
                        };

                        const handleYearChange = (value: string) => {
                           const newYear = parseInt(value);
                           setYear(newYear);
                        };

                        return (
                           <FormItem>
                              <FormLabel>Data de Nascimento</FormLabel>
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <Button
                                       variant="outline"
                                       className={cn(
                                          "text-left",
                                          profileTouched.birthDate &&
                                             (profileErrors.birthDate
                                                ? "border-destructive focus-visible:ring-destructive"
                                                : "border-green-500 focus-visible:ring-green-500")
                                       )}
                                    >
                                       {field.value
                                          ? format(field.value, "dd/MM/yyyy", {
                                               locale: ptBR,
                                            })
                                          : "Selecione uma data"}
                                    </Button>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-auto p-2">
                                    <div className="flex gap-2 mb-2">
                                       <Select
                                          value={String(month)}
                                          onValueChange={handleMonthChange}
                                       >
                                          <SelectTrigger className="w-full">
                                             <SelectValue placeholder="Mês" />
                                          </SelectTrigger>
                                          <SelectContent>
                                             {Array.from(
                                                { length: 12 },
                                                (_, i) => (
                                                   <SelectItem
                                                      key={i}
                                                      value={String(i)}
                                                   >
                                                      {format(
                                                         new Date(2000, i, 1),
                                                         "MMMM",
                                                         { locale: ptBR }
                                                      )}
                                                   </SelectItem>
                                                )
                                             )}
                                          </SelectContent>
                                       </Select>
                                       <Select
                                          value={String(year)}
                                          onValueChange={handleYearChange}
                                       >
                                          <SelectTrigger className="w-full">
                                             <SelectValue placeholder="Ano" />
                                          </SelectTrigger>
                                          <SelectContent>
                                             {Array.from(
                                                { length: 100 },
                                                (_, i) => {
                                                   const y =
                                                      new Date().getFullYear() -
                                                      i;
                                                   return (
                                                      <SelectItem
                                                         key={y}
                                                         value={String(y)}
                                                      >
                                                         {y}
                                                      </SelectItem>
                                                   );
                                                }
                                             )}
                                          </SelectContent>
                                       </Select>
                                    </div>
                                    <div className="rounded-md border">
                                       <Calendar
                                          mode="single"
                                          selected={field.value}
                                          onSelect={field.onChange}
                                          month={new Date(year, month)}
                                          onMonthChange={(date) => {
                                             setMonth(date.getMonth());
                                             setYear(date.getFullYear());
                                          }}
                                          toDate={new Date()}
                                          locale={ptBR}
                                       />
                                    </div>
                                 </PopoverContent>
                              </Popover>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />

                  <FormField
                     control={profileControl}
                     name="gender"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Gênero</FormLabel>
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value || undefined}
                           >
                              <FormControl>
                                 <SelectTrigger
                                    className={cn(
                                       "w-full",
                                       profileTouched.gender &&
                                          (profileErrors.gender
                                             ? "border-destructive focus-visible:ring-destructive"
                                             : "border-green-500 focus-visible:ring-green-500")
                                    )}
                                 >
                                    <SelectValue placeholder="Selecione" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 <SelectGroup>
                                    <SelectLabel>Gêneros</SelectLabel>
                                    {Object.entries(GenderLabels).map(
                                       ([key, label]) => (
                                          <SelectItem key={key} value={key}>
                                             {label}
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

                  <div className="md:col-span-2 flex justify-end">
                     <Button type="submit" disabled={submittingProfile}>
                        {submittingProfile && (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Salvar Perfil
                     </Button>
                  </div>
               </form>
            </Form>
         </section>
      </div>
   );
}
