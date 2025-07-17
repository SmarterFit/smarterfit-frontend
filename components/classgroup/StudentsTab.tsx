"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { classGroupUserService } from "@/backend/modules/classgroup/service/classGroupUserService";
import { SuccessToast, ErrorToast } from "@/components/toasts/Toasts";
import { Loader2 } from "lucide-react";
import { AddEmployeeToClassDialog } from "@/components/dialogs/classgroup/AddEmployeeToClassDialog";
import type { ClassUsersResponseDTO } from "@/backend/modules/classgroup/types/classGroupUserType";
import { SelectPlanDialog } from "@/components/dialogs/classgroup/SelectPlanDialog";
import { useAuthorization } from "@/hooks/useAuthorization";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AxiosError } from "axios";

interface StudentsTabProps {
   classGroupId: string;
   currentUserId: string;
}

export function StudentsTab({ classGroupId, currentUserId }: StudentsTabProps) {
   const [members, setMembers] = useState<ClassUsersResponseDTO[]>([]);
   const [loading, setLoading] = useState(true);
   const [joiningAsStudent, setJoiningAsStudent] = useState(false);
   const [joiningAsTeacher, setJoiningAsTeacher] = useState(false);
   const [selectPlanDialogOpen, setSelectPlanDialogOpen] = useState(false);
   const [removingUserId, setRemovingUserId] = useState<string | null>(null);
   const [showConfirmDialog, setShowConfirmDialog] = useState(false);

   const { isMember } = useAuthorization();

   const isTeacher = !isMember();

   const fetchMembers = async () => {
      setLoading(true);
      try {
         const [students, teachers] = await Promise.all([
            classGroupUserService.getStudentsByClassGroupId(classGroupId),
            classGroupUserService.getTeachersByClassGroupId(classGroupId),
         ]);
         const combined = [
            ...students.map((s) => ({ ...s, isTeacher: false })),
            ...teachers.map((t) => ({ ...t, isTeacher: true })),
         ];
         setMembers(combined);
      } catch (error) {
         ErrorToast("Falha ao carregar membros da turma");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchMembers();
   }, [classGroupId]);

   const handleJoinAsStudent = () => {
      setSelectPlanDialogOpen(true);
   };

   const handleJoinAsTeacher = async () => {
      setJoiningAsTeacher(true);
      try {
         await classGroupUserService.addEmployeeToClassGroup({ classGroupId });
         SuccessToast("Sucesso", "Você entrou na turma como professor!");
         await fetchMembers();
      } catch (error: unknown) {
         if (error instanceof AxiosError) {
            ErrorToast(error.response?.data?.message);
         } else {
            ErrorToast("Falha ao entrar na turma");
         }
      } finally {
         setJoiningAsTeacher(false);
      }
   };

   const handleAddMemberSuccess = async () => {
      try {
         await fetchMembers();
      } catch {
         ErrorToast("Falha ao atualizar lista de membros");
      }
   };

   const handleRemove = async () => {
      // Adicionamos uma verificação explícita para garantir que removingUserId não é null
      if (!removingUserId || !classGroupId) {
         ErrorToast("ID inválido para remoção");
         setRemovingUserId(null);
         setShowConfirmDialog(false);
         return;
      }

      try {
         await classGroupUserService.removeUserFromClassGroup(
            classGroupId,
            removingUserId
         );
         SuccessToast(
            "Sucesso!",
            removingUserId === currentUserId
               ? "Você saiu da turma"
               : "Membro removido"
         );
         await fetchMembers();
      } catch (error) {
         if (error instanceof AxiosError) {
            ErrorToast(error.response?.data?.message);
         } else {
            ErrorToast("Falha ao remover membro");
         }
      } finally {
         setRemovingUserId(null);
         setShowConfirmDialog(false);
      }
   };

   const confirmRemove = (userId: string) => {
      setRemovingUserId(userId);
      setShowConfirmDialog(true);
   };

   const isCurrentUserInClass = members.some(
      (member) => member.userId === currentUserId
   );

   if (loading) {
      return (
         <Card>
            <CardHeader>
               <div className="flex justify-between items-center">
                  <CardTitle>Membros da Turma</CardTitle>
                  <div className="flex gap-2">
                     {!isTeacher && !isCurrentUserInClass && (
                        <>
                           <Button
                              onClick={() => setSelectPlanDialogOpen(true)}
                              disabled={joiningAsStudent}
                              variant="default"
                           >
                              {joiningAsStudent ? (
                                 <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Entrando...
                                 </>
                              ) : (
                                 "Entrar como Aluno"
                              )}
                           </Button>

                           <SelectPlanDialog
                              classGroupId={classGroupId}
                              userId={currentUserId}
                              open={selectPlanDialogOpen}
                              onOpenChange={setSelectPlanDialogOpen}
                              onSuccess={async () => {
                                 setJoiningAsStudent(true);
                                 try {
                                    // Atualiza a lista de membros após entrar na turma
                                    const [students, teachers] =
                                       await Promise.all([
                                          classGroupUserService.getStudentsByClassGroupId(
                                             classGroupId
                                          ),
                                          classGroupUserService.getTeachersByClassGroupId(
                                             classGroupId
                                          ),
                                       ]);
                                    setMembers([
                                       ...students.map((s) => ({
                                          ...s,
                                          isTeacher: false,
                                       })),
                                       ...teachers.map((t) => ({
                                          ...t,
                                          isTeacher: true,
                                       })),
                                    ]);
                                    SuccessToast(
                                       "Sucesso",
                                       "Você entrou na turma como aluno!"
                                    );
                                 } catch (error) {
                                    ErrorToast(
                                       "Falha ao atualizar lista de membros"
                                    );
                                 } finally {
                                    setJoiningAsStudent(false);
                                 }
                              }}
                           />
                           {!isMember() && (
                              <Button
                                 onClick={handleJoinAsTeacher}
                                 disabled={joiningAsTeacher}
                                 variant="outline"
                              >
                                 {joiningAsTeacher ? (
                                    <>
                                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                       Entrando...
                                    </>
                                 ) : (
                                    "Entrar como Professor"
                                 )}
                              </Button>
                           )}
                        </>
                     )}

                     {!isTeacher && (
                        <>
                           <AddEmployeeToClassDialog
                              classGroupId={classGroupId}
                              onSuccess={handleAddMemberSuccess}
                              requesterId={currentUserId}
                              triggerComponent={
                                 <Button variant="outline">
                                    Adicionar Professor
                                 </Button>
                              }
                           />
                        </>
                     )}
                  </div>
               </div>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {members.length === 0 ? (
                     <p className="text-muted-foreground text-center py-4">
                        Nenhum membro nesta turma
                     </p>
                  ) : (
                     members.map((member) => (
                        <div
                           key={member.userId}
                           className="flex items-center justify-between p-3 border rounded-lg"
                        >
                           <div className="flex items-center space-x-3">
                              <Avatar>
                                 <AvatarFallback>
                                    {member.name?.charAt(0) || "A"}
                                 </AvatarFallback>
                              </Avatar>
                              <div>
                                 <p className="font-medium">
                                    {member.name || member.email}
                                    {member.userId === currentUserId && (
                                       <span className="ml-2 text-sm text-muted-foreground">
                                          (Você)
                                       </span>
                                    )}
                                 </p>
                                 <p className="text-sm text-muted-foreground">
                                    {member.email}
                                 </p>
                              </div>
                           </div>
                           <Badge
                              variant={
                                 member.isTeacher ? "default" : "secondary"
                              }
                           >
                              {member.isTeacher ? "Professor" : "Aluno"}
                           </Badge>
                        </div>
                     ))
                  )}
               </div>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card>
         <CardHeader>
            <div className="flex justify-between items-center">
               <CardTitle>Membros da Turma</CardTitle>
               <div className="flex gap-2">
                  {!isTeacher && !isCurrentUserInClass && (
                     <>
                        <Button
                           onClick={handleJoinAsStudent}
                           disabled={joiningAsStudent}
                           variant="default"
                        >
                           {joiningAsStudent ? (
                              <>
                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                 Entrando...
                              </>
                           ) : (
                              "Entrar como Aluno"
                           )}
                        </Button>

                        <SelectPlanDialog
                           classGroupId={classGroupId}
                           userId={currentUserId}
                           open={selectPlanDialogOpen}
                           onOpenChange={setSelectPlanDialogOpen}
                           onSuccess={async () => {
                              setJoiningAsStudent(true);
                              try {
                                 await fetchMembers();
                                 SuccessToast(
                                    "Sucesso",
                                    "Você entrou na turma como aluno!"
                                 );
                              } catch (error) {
                                 ErrorToast(
                                    "Falha ao atualizar lista de membros"
                                 );
                              } finally {
                                 setJoiningAsStudent(false);
                              }
                           }}
                        />
                        {!isMember() && (
                           <Button
                              onClick={handleJoinAsTeacher}
                              disabled={joiningAsTeacher}
                              variant="outline"
                           >
                              {joiningAsTeacher ? (
                                 <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Entrando...
                                 </>
                              ) : (
                                 "Entrar como Professor"
                              )}
                           </Button>
                        )}
                     </>
                  )}

                  {isTeacher && (
                     <AddEmployeeToClassDialog
                        classGroupId={classGroupId}
                        onSuccess={handleAddMemberSuccess}
                        requesterId={currentUserId}
                        triggerComponent={
                           <Button variant="outline">
                              Adicionar Professor
                           </Button>
                        }
                     />
                  )}
               </div>
            </div>
         </CardHeader>
         <CardContent>
            <div className="space-y-4">
               {members.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                     Nenhum membro nesta turma
                  </p>
               ) : (
                  members.map((member) => {
                     const canRemove =
                        isTeacher || member.userId === currentUserId;
                     const isCurrentUser = member.userId === currentUserId;

                     return (
                        <div
                           key={member.userId}
                           className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                           <div className="flex items-center space-x-3">
                              <Avatar>
                                 <AvatarFallback>
                                    {member.name?.charAt(0) || "A"}
                                 </AvatarFallback>
                              </Avatar>
                              <div>
                                 <p className="font-medium">
                                    {member.name || member.email}
                                    {isCurrentUser && (
                                       <span className="ml-2 text-sm text-muted-foreground">
                                          (Você)
                                       </span>
                                    )}
                                 </p>
                                 <p className="text-sm text-muted-foreground">
                                    {member.email}
                                 </p>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <Badge
                                 variant={
                                    member.isTeacher ? "default" : "secondary"
                                 }
                                 className="h-8 flex items-center px-3"
                              >
                                 {member.isTeacher ? "Professor" : "Aluno"}
                              </Badge>
                              {canRemove && (
                                 <Button
                                    size="sm"
                                    onClick={() => confirmRemove(member.userId)}
                                    className="bg-destructive hover:bg-destructive/90"
                                 >
                                    {isCurrentUser ? "Sair" : "Remover"}
                                 </Button>
                              )}
                           </div>
                        </div>
                     );
                  })
               )}
            </div>
         </CardContent>

         <AlertDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
         >
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>
                     {removingUserId === currentUserId
                        ? "Tem certeza que deseja sair da turma?"
                        : "Tem certeza que deseja remover este membro?"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                     {removingUserId === currentUserId
                        ? "Você perderá acesso a todos os conteúdos desta turma."
                        : "Este membro perderá acesso a todos os conteúdos desta turma."}
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={handleRemove}
                     className="bg-destructive hover:bg-destructive/90"
                  >
                     {removingUserId === currentUserId ? "Sair" : "Remover"}
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </Card>
   );
}
