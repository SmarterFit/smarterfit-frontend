"use client";
import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
   Card,
   CardHeader,
   CardTitle,
   CardContent,
   CardDescription,
   CardFooter,
} from "@/components/ui/card";
import {
   Calendar,
   Users,
   BookOpen,
   Clock,
   MapPin,
   AlertCircle,
   FileText, // Ícone para Notas
} from "lucide-react";
import { ClassGroupService } from "@/backend/modules/classgroup/service/classGroupService";
import { Badge } from "@/components/ui/badge";
import { StudentsTab } from "@/components/classgroup/StudentsTab";
import { PlansClassTab } from "@/components/classgroup/PlansClassTab";
import { SessionsTab } from "@/components/classgroup/SessionsTab";
import { ScheduleTab } from "@/components/classgroup/ScheduleTab";
import { SuccessToast, ErrorToast } from "@/components/toasts/Toasts";
import Cookies from "js-cookie";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ClassGroupResponseDTO } from "@/backend/modules/classgroup/types/classGroupTypes";
import { MetricsTab } from "@/components/metrics/MetricsTab";
import { useUser } from "@/hooks/useUser";

export default function TurmaPageClient() {
   const [turma, setTurma] = useState<ClassGroupResponseDTO | null>(null);
   const [loading, setLoading] = useState(true);
   const router = useRouter();
   const [turmaId, setTurmaId] = useState<string | null>(null);
   const currentUserId = Cookies.get("userId");
   const [deletingClass, setDeletingClass] = useState(false);
   const { isMember } = useAuthorization();
   const user = useUser();

   useEffect(() => {
      const id = localStorage.getItem("selectedTurmaId");
      setTurmaId(id);
      if (!id) {
         router.push("/dashboard/turmas");
         return;
      }

      setLoading(true);
      ClassGroupService.getById(id)
         .then((data) => {
            if (!data) {
               router.push("/dashboard/turmas");
               return;
            }
            setTurma(data);
         })
         .finally(() => setLoading(false));
   }, [router]);

   if (loading)
      return (
         <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
         </div>
      );

   if (!turma)
      return (
         <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h2 className="text-2xl font-bold">Turma não encontrada</h2>
            <Button onClick={() => router.push("/dashboard/turmas")}>
               Voltar para lista de turmas
            </Button>
         </div>
      );

   const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
      };
      return new Date(dateString).toLocaleDateString("pt-BR", options);
   };

   const handleDeleteClass = async () => {
      if (!turma?.id) return;

      setDeletingClass(true);
      try {
         await ClassGroupService.delete(turma.id);
         SuccessToast("", "Turma deletada com sucesso");
         router.push("/dashboard/turmas");
      } catch (error: any) {
         ErrorToast(error.response?.data?.message || "Falha ao deletar turma");
      } finally {
         setDeletingClass(false);
      }
   };

   return (
      <div className="container mx-auto px-4 py-8 space-y-8">
         {/* Cabeçalho */}
         <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">
               Detalhes da Turma
            </h1>
            <Button
               variant="outline"
               onClick={() => router.push("/dashboard/turmas")}
            >
               Voltar
            </Button>
         </div>

         {/* Informações principais */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
               <CardHeader>
                  <div className="flex justify-between items-start">
                     <div>
                        <CardTitle className="text-2xl">
                           {turma.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                           {turma.description}
                        </CardDescription>
                     </div>
                     <Badge variant="outline" className="text-sm">
                        {turma.modalityDTO.name}
                     </Badge>
                  </div>
               </CardHeader>
               <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                     <Users className="h-5 w-5 text-muted-foreground" />
                     <div>
                        <p className="text-sm text-muted-foreground">Alunos</p>
                        <p className="font-medium">
                           {turma.totalMembers}/{turma.capacity}
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-3">
                     <Calendar className="h-5 w-5 text-muted-foreground" />
                     <div>
                        <p className="text-sm text-muted-foreground">Período</p>
                        <p className="font-medium">
                           {formatDate(turma.startDate)} -{" "}
                           {formatDate(turma.endDate)}
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-3">
                     <MapPin className="h-5 w-5 text-muted-foreground" />
                     <div>
                        <p className="text-sm text-muted-foreground">Local</p>
                        <p className="font-medium">Sala 3 </p>
                     </div>
                  </div>
               </CardContent>
               <CardFooter className="flex flex-col items-start space-y-3">
                  {/* ... (código da barra de ocupação) ... */}
                  <div className="flex space-x-2">
                     <AlertDialog>
                        {!isMember() && (
                           <AlertDialogTrigger asChild>
                              <Button variant="destructive">
                                 Deletar Turma
                              </Button>
                           </AlertDialogTrigger>
                        )}
                        <AlertDialogContent>
                           <AlertDialogHeader>
                              <AlertDialogTitle>
                                 Confirmar exclusão da turma
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                 Tem certeza que deseja deletar permanentemente
                                 esta turma? Todos os dados associados serão
                                 perdidos e esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                           </AlertDialogHeader>
                           <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                 onClick={handleDeleteClass}
                                 disabled={deletingClass}
                                 className="bg-destructive hover:bg-destructive/90"
                              >
                                 {deletingClass
                                    ? "Deletando..."
                                    : "Confirmar Exclusão"}
                              </AlertDialogAction>
                           </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog>
                  </div>
               </CardFooter>
            </Card>
         </div>

         {/* Abas de conteúdo */}
         <Tabs defaultValue="alunos" className="w-full">
            <TabsList className="w-full justify-start gap-2">
               <TabsTrigger value="alunos" className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> Alunos
               </TabsTrigger>
               <TabsTrigger value="planos" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Planos
               </TabsTrigger>
               <TabsTrigger
                  value="horarios"
                  className="flex items-center gap-2"
               >
                  <Clock className="h-4 w-4" /> Horários
               </TabsTrigger>
               <TabsTrigger value="aulas" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Aulas
               </TabsTrigger>
            </TabsList>

            <TabsContent value="alunos" className="pt-4">
               <StudentsTab
                  classGroupId={turmaId || ""}
                  currentUserId={currentUserId || ""}
               />
            </TabsContent>

            <TabsContent value="planos" className="pt-4">
               {turmaId && <PlansClassTab classGroupId={turmaId} />}
            </TabsContent>

            <TabsContent value="horarios" className="pt-4">
               {turmaId && <ScheduleTab classGroupId={turmaId} />}
            </TabsContent>

            <TabsContent value="aulas" className="pt-4">
               {turmaId && <SessionsTab classGroupId={turmaId} />}
            </TabsContent>
         </Tabs>
      </div>
   );
}
