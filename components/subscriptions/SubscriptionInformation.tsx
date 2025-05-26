"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { SubscriptionResponseDTO } from "@/backend/modules/billing/types/subscriptionTypes";
import { Button } from "@/components/ui/button";
import {
   AlertDialog,
   AlertDialogTrigger,
   AlertDialogContent,
   AlertDialogHeader,
   AlertDialogFooter,
   AlertDialogTitle,
   AlertDialogDescription,
   AlertDialogCancel,
   AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { subscriptionUserService } from "@/backend/modules/billing/services/subscriptionUserServices";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown } from "lucide-react";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";
import { format } from "date-fns";
import { subscriptionService } from "@/backend/modules/billing/services/subscriptionServices";
import { SubscriptionStatusLabels } from "@/backend/common/enums/subscriptionStatusEnum";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { PaymentsTabContent } from "./PaymentTabContent";

interface SubscriptionInformationProps {
   subscription: SubscriptionResponseDTO;
   loggedUserId?: string; // ID do usuário logado, para controlar permissões
}

export function SubscriptionInformation({
   subscription,
   loggedUserId,
}: SubscriptionInformationProps) {
   const {
      owner,
      plan,
      startedIn,
      renewedIn,
      endedIn,
      status,
      availableMembers,
      availableClasses,
      id,
   } = subscription;

   const [members, setMembers] = useState<UserResponseDTO[]>([]);
   const [loadingRemove, setLoadingRemove] = useState<string | null>(null);
   const [newMemberEmail, setNewMemberEmail] = useState("");
   const [loadingAddMember, setLoadingAddMember] = useState(false);

   const formatDate = (dateString: string | null | undefined) => {
      return dateString
         ? format(new Date(dateString), "dd/MM/yyyy")
         : "Não informado";
   };

   const handleCancel = async () => {
      try {
         await subscriptionService.cancel(id);
         SuccessToast(
            "Assinatura cancelada com sucesso.",
            "Sua assinatura foi cancelada."
         );
      } catch (e: any) {
         ErrorToast(e.message);
      }
   };

   const fetchMembers = async () => {
      try {
         const users =
            await subscriptionUserService.getAllUsersBySubscriptionId(id);
         setMembers(users);
      } catch (e: any) {
         ErrorToast("Erro ao carregar membros: " + e.message);
      }
   };

   useEffect(() => {
      if (status !== "CANCELED") {
         fetchMembers();
      }
   }, [id, status]);

   // Função para remover membro
   const handleRemoveMember = async (userId: string) => {
      setLoadingRemove(userId);
      try {
         await subscriptionUserService.removeMember(id, userId);
         SuccessToast(
            "Usuário removido com sucesso.",
            "O usuário foi removido do seu plano."
         );
         setMembers((prev) => prev.filter((m) => m.id !== userId));
      } catch (e: any) {
         ErrorToast("Erro ao remover usuário: " + e.message);
      } finally {
         setLoadingRemove(null);
      }
   };

   const handleAddMember = async () => {
      if (!newMemberEmail.trim()) {
         toast.error("Por favor, insira um email válido.");
         return;
      }

      setLoadingAddMember(true);
      try {
         const newMember = await subscriptionUserService.addMemberByEmail({
            subscriptionId: id,
            userEmail: newMemberEmail.trim(),
         });
         SuccessToast(
            "Membro adicionado com sucesso.",
            `${newMember.user.profile.fullName} foi adicionado ao plano.`
         );
         setMembers((prev) => [...prev, newMember.user]);
         setNewMemberEmail("");
      } catch (e: any) {
         ErrorToast("Erro ao adicionar membro: " + e.message);
      } finally {
         setLoadingAddMember(false);
      }
   };

   const isOwnerLogged = loggedUserId === owner.id;

   return (
      <div className="w-full flex flex-col gap-4">
         <h3 className="text-lg font-semibold">
            Detalhes da Assinatura: {plan.name}
         </h3>
         <Separator />

         <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full">
               <TabsTrigger value="info">Informações Gerais</TabsTrigger>
               {status !== "CANCELED" && (
                  <>
                     <TabsTrigger value="members">Membros</TabsTrigger>
                     <TabsTrigger value="payments">Pagamentos</TabsTrigger>
                  </>
               )}
            </TabsList>

            <TabsContent value="info" className="mt-4 space-y-3">
               <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div>
                     <h4 className="font-semibold">Proprietário:</h4>
                     <p>{owner.profile.fullName}</p>
                  </div>

                  <div>
                     <h4 className="font-semibold">Plano:</h4>
                     <p>{plan.name}</p>
                  </div>

                  <div>
                     <h4 className="font-semibold">Valor da Assinatura:</h4>
                     <p>R$ {plan.price.toFixed(2)}</p>
                  </div>

                  <div>
                     <h4 className="font-semibold">Duração:</h4>
                     <p>{plan.duration} dias</p>
                  </div>

                  <div>
                     <h4 className="font-semibold">Data de Início:</h4>
                     <p>{formatDate(startedIn)}</p>
                  </div>

                  <div>
                     <h4 className="font-semibold">Data de Renovação:</h4>
                     <p>{formatDate(renewedIn)}</p>
                  </div>

                  <div>
                     <h4 className="font-semibold">Data de Finalização:</h4>
                     <p>{formatDate(endedIn)}</p>
                  </div>

                  <div>
                     <h4 className="font-semibold">Status:</h4>
                     <Badge>{SubscriptionStatusLabels[status]}</Badge>
                  </div>

                  <div>
                     <h4 className="font-semibold">Membros Disponíveis:</h4>
                     <p>
                        {availableMembers} / {plan.maxUsers}
                     </p>
                  </div>

                  <div>
                     <h4 className="font-semibold">Turmas Disponíveis:</h4>
                     <p>
                        {availableClasses} / {plan.maxClasses}
                     </p>
                  </div>
               </div>

               {isOwnerLogged && status !== "CANCELED" && (
                  <>
                     <Separator />

                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="destructive">
                              Cancelar Assinatura
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                           <AlertDialogHeader>
                              <AlertDialogTitle>
                                 Cancelar Assinatura
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                 Tem certeza que deseja cancelar esta
                                 assinatura? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                           </AlertDialogHeader>
                           <AlertDialogFooter>
                              <AlertDialogCancel>Voltar</AlertDialogCancel>
                              <AlertDialogAction onClick={handleCancel}>
                                 Confirmar
                              </AlertDialogAction>
                           </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog>
                  </>
               )}
            </TabsContent>

            {status !== "CANCELED" && (
               <>
                  <TabsContent value="members" className="mt-4">
                     {isOwnerLogged && (
                        <div className="mb-4 flex gap-2 items-center">
                           <Input
                              type="email"
                              placeholder="Digite o email do novo membro"
                              className="border rounded px-3 py-2 flex-grow"
                              value={newMemberEmail}
                              onChange={(e) =>
                                 setNewMemberEmail(e.target.value)
                              }
                              disabled={loadingAddMember}
                           />
                           <Button
                              onClick={handleAddMember}
                              disabled={
                                 loadingAddMember ||
                                 newMemberEmail.trim() === ""
                              }
                           >
                              {loadingAddMember
                                 ? "Adicionando..."
                                 : "Adicionar"}
                           </Button>
                        </div>
                     )}
                     <Table>
                        <TableHeader>
                           <TableRow>
                              <TableHead>Avatar</TableHead>
                              <TableHead>Nome</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Ações</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {members.map((member) => {
                              const isOwner = member.id === owner.id;
                              const firstLetter = member.profile.fullName
                                 .charAt(0)
                                 .toUpperCase();
                              return (
                                 <TableRow key={member.id}>
                                    <TableCell>
                                       <Avatar>
                                          <AvatarFallback
                                             className={
                                                isOwner
                                                   ? "bg-yellow-400 text-black"
                                                   : ""
                                             }
                                          >
                                             {firstLetter}
                                          </AvatarFallback>
                                       </Avatar>
                                    </TableCell>
                                    <TableCell>
                                       <div className="flex gap-2 items-center">
                                          {member.profile.fullName}
                                          {isOwner && (
                                             <Crown className="w-4 h-4 text-yellow-500" />
                                          )}
                                       </div>
                                    </TableCell>
                                    <TableCell>{member.email}</TableCell>

                                    <TableCell>
                                       {isOwnerLogged ||
                                          (loggedUserId === member.id && (
                                             <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                   <Button
                                                      variant="destructive"
                                                      size="sm"
                                                      disabled={
                                                         loadingRemove ===
                                                         member.id
                                                      }
                                                   >
                                                      Remover
                                                   </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                   <AlertDialogHeader>
                                                      <AlertDialogTitle>
                                                         Remover Membro
                                                      </AlertDialogTitle>
                                                      <AlertDialogDescription>
                                                         Tem certeza que deseja
                                                         remover{" "}
                                                         <strong>
                                                            {
                                                               member.profile
                                                                  .fullName
                                                            }
                                                         </strong>{" "}
                                                         da assinatura? Essa
                                                         ação não pode ser
                                                         desfeita.
                                                      </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                   <AlertDialogFooter>
                                                      <AlertDialogCancel>
                                                         Cancelar
                                                      </AlertDialogCancel>
                                                      <AlertDialogAction
                                                         onClick={() =>
                                                            handleRemoveMember(
                                                               member.id
                                                            )
                                                         }
                                                         disabled={
                                                            loadingRemove ===
                                                            member.id
                                                         }
                                                      >
                                                         {loadingRemove ===
                                                         member.id
                                                            ? "Removendo..."
                                                            : "Confirmar"}
                                                      </AlertDialogAction>
                                                   </AlertDialogFooter>
                                                </AlertDialogContent>
                                             </AlertDialog>
                                          ))}
                                    </TableCell>
                                 </TableRow>
                              );
                           })}
                        </TableBody>
                     </Table>
                  </TabsContent>

                  <TabsContent value="payments" className="mt-4">
                     <PaymentsTabContent
                        subscriptionId={id}
                        endedIn={endedIn}
                        isOwnerLogged={isOwnerLogged}
                     />
                  </TabsContent>
               </>
            )}
         </Tabs>
      </div>
   );
}
