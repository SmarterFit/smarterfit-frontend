'use client'

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

interface StudentsTabProps {
  classGroupId: string;
  currentUserId: string;
  isTeacher?: boolean;
}

export function StudentsTab({ classGroupId, currentUserId, isTeacher = false }: StudentsTabProps) {
  const [members, setMembers] = useState<ClassUsersResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningAsStudent, setJoiningAsStudent] = useState(false);
  const [joiningAsTeacher, setJoiningAsTeacher] = useState(false);
  const [selectPlanDialogOpen, setSelectPlanDialogOpen] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const [students, teachers] = await Promise.all([
        classGroupUserService.getStudentsByClassGroupId(classGroupId),
        classGroupUserService.getTeachersByClassGroupId(classGroupId)
      ]);
      const combined = [
        ...students.map(s => ({ ...s, isTeacher: false })),
        ...teachers.map(t => ({ ...t, isTeacher: true }))
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

  const handleRemove = async () => {
    if (!removingUserId) return;

    try {
      await classGroupUserService.removeUserFromClassGroup(classGroupId, removingUserId);
      SuccessToast(removingUserId === currentUserId ? "Você saiu da turma" : "Membro removido");
      fetchMembers();
    } catch (error) {
      if (error.response?.status === 404) {
        ErrorToast("Usuário já não está na turma");
        fetchMembers(); // Atualiza a lista pois pode estar desatualizada
      } else {
        ErrorToast(error.response?.data?.message || "Erro ao remover membro");
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

  // ... (mantenha as outras funções como handleJoinAsTeacher, handleAddMemberSuccess, etc.)

  const isCurrentUserInClass = members.some(member => member.userId === currentUserId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Membros da Turma</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
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
            {/* ... (mantenha os botões existentes) ... */}
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
              const canRemove = isTeacher || member.userId === currentUserId;
              const isCurrentUser = member.userId === currentUserId;

              return (
                <div
                  key={member.userId}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {member.name || member.email}
                        {isCurrentUser && (
                          <span className="ml-2 text-sm text-muted-foreground">(Você)</span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={member.isTeacher ? "default" : "secondary"}
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

      {/* Dialog de confirmação */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
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