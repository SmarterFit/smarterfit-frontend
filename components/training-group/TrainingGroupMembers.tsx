import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
   Table,
   TableHeader,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
   AlertDialog,
   AlertDialogTrigger,
   AlertDialogContent,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogCancel,
   AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormMessage,
   FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TrainingGroupUserResponseDTO } from "@/backend/modules/training-group/types/trainingGroupUserTypes";
import { trainingGroupUserService } from "@/backend/modules/training-group/services/trainingGroupUserServices";
import { ErrorToast, SuccessToast } from "@/components/toasts/Toasts";
import {
   AddMemberByEmailRequestDTO,
   addMemberByEmailRequestSchema,
} from "@/backend/modules/training-group/schemas/trainingGroupUserSchemas";

interface TrainingGroupMembersProps {
   groupId: string;
   currentUserId: string;
   initialMembers: TrainingGroupUserResponseDTO[];
   isCurrentUserAdmin: boolean;
}

export function TrainingGroupMembers({
   groupId,
   currentUserId,
   initialMembers,
   isCurrentUserAdmin,
}: TrainingGroupMembersProps) {
   const router = useRouter();
   const [members, setMembers] = useState(initialMembers);
   const [loadingIds, setLoadingIds] = useState<string[]>([]);

   // React Hook Form
   const form = useForm<AddMemberByEmailRequestDTO>({
      resolver: zodResolver(addMemberByEmailRequestSchema),
      defaultValues: { email: "", trainingGroupId: groupId },
   });

   // Sair do grupo
   const handleLeaveGroup = async () => {
      try {
         await trainingGroupUserService.removeUserFromTrainingGroup(
            groupId,
            currentUserId
         );
         SuccessToast("Você saiu do grupo.", "Até mais!");
         router.push("/dashboard");
      } catch (e: any) {
         ErrorToast(e.message);
         router.push("/dashboard");
      }
   };

   // Toggle admin
   const handleToggleAdmin = async (memberId: string, makeAdmin: boolean) => {
      setLoadingIds((ids) => [...ids, memberId]);
      try {
         const updated = makeAdmin
            ? await trainingGroupUserService.setUserAsAdmin(groupId, memberId)
            : await trainingGroupUserService.removeUserAsAdmin(
                 groupId,
                 memberId
              );
         setMembers((prev) =>
            prev.map((m) => (m.user.id === memberId ? updated : m))
         );
         SuccessToast(
            "Membro atualizado.",
            `Admin ${makeAdmin ? "adicionado" : "removido"}.`
         );
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setLoadingIds((ids) => ids.filter((id) => id !== memberId));
      }
   };

   // Remover membro
   const handleRemoveMember = async (memberId: string) => {
      setLoadingIds((ids) => [...ids, memberId]);
      try {
         await trainingGroupUserService.removeUserFromTrainingGroup(
            groupId,
            memberId
         );
         setMembers((prev) => prev.filter((m) => m.user.id !== memberId));
         SuccessToast("Membro removido.", "O membro foi removido.");
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setLoadingIds((ids) => ids.filter((id) => id !== memberId));
      }
   };

   // Adicionar membro
   const onSubmit = async (values: AddMemberByEmailRequestDTO) => {
      console.log(values);
      try {
         const newMember = await trainingGroupUserService.addMemberByEmail(
            values
         );
         setMembers((prev) => [...prev, newMember]);
         SuccessToast(
            "Membro adicionado.",
            `${newMember.user.profile.fullName} entrou no grupo.`
         );
         form.reset({ email: "", trainingGroupId: groupId });
      } catch (e: any) {
         ErrorToast(e.message);
      }
   };

   return (
      <div className="space-y-6">
         {/* Ações iniciais */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Sair do grupo */}
            <AlertDialog>
               <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                     Sair do grupo
                  </Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                  <AlertDialogHeader>
                     <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                     <AlertDialogDescription>
                        Você sairá deste grupo e perderá acesso.
                     </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                     <AlertDialogCancel>Cancelar</AlertDialogCancel>
                     <AlertDialogAction onClick={handleLeaveGroup}>
                        Sair
                     </AlertDialogAction>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialog>

            {/* Adicionar membro (só para admin) */}
            {isCurrentUserAdmin && (
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="flex items-end gap-2 w-full sm:w-auto"
                  >
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem className="flex-1">
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Email do usuário"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                     >
                        Adicionar
                     </Button>
                  </form>
               </Form>
            )}
         </div>

         {/* Tabela de membros */}
         <div className="overflow-x-auto">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Usuário</TableHead>
                     <TableHead>Admin</TableHead>
                     {isCurrentUserAdmin && (
                        <TableHead className="text-center">Ações</TableHead>
                     )}
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {members.map((member) => {
                     const { id, profile } = member.user;
                     const isAdmin = member.isAdmin;
                     const initial = profile.fullName.charAt(0).toUpperCase();
                     const isLoading = loadingIds.includes(id);

                     return (
                        <TableRow key={id}>
                           <TableCell>
                              <div className="flex items-center space-x-3">
                                 <Avatar className="w-8 h-8">
                                    <AvatarFallback>{initial}</AvatarFallback>
                                 </Avatar>
                                 <span className="font-medium">
                                    {profile.fullName}
                                 </span>
                              </div>
                           </TableCell>
                           <TableCell>
                              {isAdmin ? (
                                 <Badge variant="secondary">Admin</Badge>
                              ) : (
                                 <Badge variant="outline">Membro</Badge>
                              )}
                           </TableCell>
                           {isCurrentUserAdmin && (
                              <TableCell className="space-x-2 text-center">
                                 <Button
                                    size="sm"
                                    variant={
                                       isAdmin ? "destructive" : "default"
                                    }
                                    onClick={() =>
                                       handleToggleAdmin(id, !isAdmin)
                                    }
                                    disabled={isLoading}
                                 >
                                    {isAdmin ? "Remover Admin" : "Tornar Admin"}
                                 </Button>
                                 <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRemoveMember(id)}
                                    disabled={isLoading}
                                 >
                                    Remover
                                 </Button>
                              </TableCell>
                           )}
                        </TableRow>
                     );
                  })}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}
