import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import {
   AlertDialog,
   AlertDialogTrigger,
   AlertDialogContent,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogAction,
   AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectGroup,
   SelectLabel,
   SelectItem,
} from "@/components/ui/select";
import { ProfileResponseDTO } from "@/backend/modules/useraccess/types/profileTypes";
import { Gender, GenderLabels } from "@/backend/common/enums/genderEnum";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import { userService } from "@/backend/modules/useraccess/services/userServices";
import { RoleLabels, RoleType } from "@/backend/common/enums/rolesEnum";
import { Separator } from "../ui/separator";
import { LoadingSpinnerCSS } from "../LoadingSpinner";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";

export interface ProfileDetailsDialogProps {
   profile: ProfileResponseDTO;
   onDeleted?: () => void;
}

export function ProfileDetailsDialog({
   profile,
   onDeleted,
}: ProfileDetailsDialogProps) {
   const [open, setOpen] = useState(false);
   const [user, setUser] = useState<UserResponseDTO | null>(null);
   const [deleting, setDeleting] = useState(false);
   const [selectedRoles, setSelectedRoles] = useState<RoleType[]>([]);
   const [savingRoles, setSavingRoles] = useState(false);

   useEffect(() => {
      if (open) {
         userService
            .getById(profile.id)
            .then((u) => {
               setUser(u);
               setSelectedRoles(u.roles);
            })
            .catch(() => setUser(null));
      }
   }, [open, profile.id]);

   const age = useMemo<number | null>(() => {
      if (!profile.birthDate) return null;
      const birth = new Date(profile.birthDate);
      if (isNaN(birth.getTime())) return null;
      const today = new Date();
      let years = today.getFullYear() - birth.getFullYear();
      const hasHadBirthday =
         today.getMonth() > birth.getMonth() ||
         (today.getMonth() === birth.getMonth() &&
            today.getDate() >= birth.getDate());
      if (!hasHadBirthday) years -= 1;
      return years;
   }, [profile.birthDate]);

   const formatDate = (dateStr?: string) => {
      if (!dateStr) return "Não informado";
      const d = new Date(dateStr);
      return isNaN(d.getTime())
         ? "Não informado"
         : d.toLocaleDateString("pt-BR");
   };

   const handleDelete = async () => {
      setDeleting(true);
      try {
         await userService.delete(profile.id);
         SuccessToast(
            "Usuário deletado!",
            `O usuário ${profile.fullName} foi deletado.`
         );
         setOpen(false);
         onDeleted?.();
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setDeleting(false);
      }
   };

   const addRole = (value: string) => {
      const role = value as RoleType;
      if (!selectedRoles.includes(role)) {
         setSelectedRoles((prev) => [...prev, role]);
      }
   };

   const removeRole = (role: RoleType) => {
      setSelectedRoles((prev) => prev.filter((r) => r !== role));
   };

   const handleSaveRoles = async () => {
      if (selectedRoles.length < 1) {
         ErrorToast("Pelo menos um cargo deve ser selecionado.");
         return;
      }
      setSavingRoles(true);
      try {
         const updated = await userService.updateRolesById(profile.id, {
            roles: selectedRoles as [RoleType, ...RoleType[]],
         });
         localStorage.setItem("user", JSON.stringify(updated));
         setUser(updated);
         SuccessToast(
            "Cargos atualizados!",
            "Permissões do usuário foram salvas."
         );
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setSavingRoles(false);
      }
   };

   return (
      <>
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
               <Button variant="outline" size="sm">
                  Detalhes
               </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md p-4">
               <DialogHeader>
                  <DialogTitle>Detalhes do usuário</DialogTitle>
                  <DialogDescription>
                     Você pode adicionar ou remover cargos do usuário.
                  </DialogDescription>
               </DialogHeader>
               {/* Container principal */}
               <div className="space-y-4">
                  {/* Cabeçalho com nome e ações */}
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-semibold">
                        {profile.fullName || "Não informado"}
                     </h2>
                     <div className="flex gap-2">
                        <Button
                           onClick={handleSaveRoles}
                           disabled={savingRoles || !user}
                           size="sm"
                        >
                           {savingRoles ? "Salvando..." : "Salvar"}
                        </Button>
                        <AlertDialog>
                           <AlertDialogTrigger asChild>
                              <Button
                                 variant="destructive"
                                 size="sm"
                                 disabled={deleting}
                              >
                                 {deleting ? "Deletando..." : "Deletar"}
                              </Button>
                           </AlertDialogTrigger>
                           <AlertDialogContent>
                              <AlertDialogHeader>
                                 <AlertDialogTitle>
                                    Confirma exclusão?
                                 </AlertDialogTitle>
                                 <AlertDialogDescription>
                                    Esta ação não pode ser desfeita.
                                 </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                 <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                 <AlertDialogAction onClick={handleDelete}>
                                    {deleting ? "Deletando..." : "Deletar"}
                                 </AlertDialogAction>
                              </AlertDialogFooter>
                           </AlertDialogContent>
                        </AlertDialog>
                     </div>
                  </div>

                  {/* Email + selector e badges agrupados */}
                  {user ? (
                     <div className="flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground">
                           {user.email}
                        </p>
                        <div className="flex items-center gap-2">
                           <Select onValueChange={addRole} disabled={!user}>
                              <SelectTrigger>
                                 <SelectValue placeholder="Adicionar cargo" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectGroup>
                                    <SelectLabel>Cargos</SelectLabel>
                                    {Object.values(RoleType).map((r) => (
                                       <SelectItem key={r} value={r}>
                                          {RoleLabels[r]}
                                       </SelectItem>
                                    ))}
                                 </SelectGroup>
                              </SelectContent>
                           </Select>
                           <div className="flex flex-wrap gap-1">
                              {selectedRoles.map((r) => (
                                 <Badge
                                    key={r}
                                    variant="secondary"
                                    onClick={() => removeRole(r)}
                                    className="cursor-pointer"
                                 >
                                    {RoleLabels[r]} ✕
                                 </Badge>
                              ))}
                           </div>
                        </div>
                     </div>
                  ) : (
                     <p className="text-sm text-muted-foreground">
                        <LoadingSpinnerCSS />
                     </p>
                  )}

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                     <div>
                        <p className="font-medium">CPF</p>
                        <p>{profile.cpf || "Não informado"}</p>
                     </div>
                     <div>
                        <p className="font-medium">Telefone</p>
                        <p>{profile.phone || "Não informado"}</p>
                     </div>
                     <div>
                        <p className="font-medium">Nascimento</p>
                        <p>{formatDate(profile.birthDate)}</p>
                     </div>
                     <div>
                        <p className="font-medium">Idade</p>
                        <p>{age !== null ? `${age} anos` : "Não informado"}</p>
                     </div>
                     <div className="col-span-2">
                        <p className="font-medium">Gênero</p>
                        <p>
                           {profile.gender
                              ? GenderLabels[profile.gender as Gender]
                              : "Não informado"}
                        </p>
                     </div>
                     {profile.address ? (
                        <div className="col-span-2">
                           <p className="font-medium">Endereço</p>
                           <p>
                              {profile.address.street}, {profile.address.number}{" "}
                              {profile.address.neighborhood
                                 ? `- ${profile.address.neighborhood}`
                                 : ""}
                           </p>
                           <p>
                              {profile.address.city}
                              {profile.address.state
                                 ? ` - ${profile.address.state}`
                                 : ""}
                              {profile.address.cep
                                 ? `, ${profile.address.cep}`
                                 : ""}
                           </p>
                        </div>
                     ) : (
                        <div className="col-span-2">
                           <p className="font-medium">Endereço</p>
                           <p>Não informado</p>
                        </div>
                     )}
                  </div>
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
}
