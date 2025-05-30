"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, BookOpen, Clock, MapPin, AlertCircle } from "lucide-react";
import { ClassGroupService } from "@/backend/modules/classgroup/service/classGroupService";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StudentsTab } from "@/components/classgroup/StudentsTab";
import { PlansClassTab } from "@/components/classgroup/PlansClassTab";
import { SessionsTab } from "@/components/classgroup/SessionsTab";
import {EditClassGroupDialog} from "@/components/dialogs/classgroup/EditClassGroupDialog"
import { ScheduleTab } from "@/components/classgroup/ScheduleTab";
import Cookies from "js-cookie";





export default function TurmaPageClient() {
  const [turma, setTurma] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const [turmaId, setTurmaId] = useState<string | null>(null);
  const currentUserId = Cookies.get("userId");



  useEffect(() => {
    const id = localStorage.getItem("selectedTurmaId");
    setTurmaId(id);
    if (!id) {
      router.push("/dashboard/turmas");
      return;
    }

    setLoading(true);
    ClassGroupService.getById(id)
      .then(data => {
        if (!data) {
          router.push("/dashboard/turmas");
          return;
        }
        setTurma(data);
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (!turma) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <h2 className="text-2xl font-bold">Turma não encontrada</h2>
      <Button onClick={() => router.push("/turmas")}>Voltar para lista de turmas</Button>
    </div>
  );


  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Detalhes da Turma</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/turmas")}>
          Voltar
        </Button>
      </div>

      {/* Informações principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card de informações */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{turma.title}</CardTitle>
                <CardDescription className="mt-2">{turma.description}</CardDescription>
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
                <p className="font-medium">{turma.totalMembers}/{turma.capacity}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Período</p>
                <p className="font-medium">
                  {formatDate(turma.startDate)} - {formatDate(turma.endDate)}
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
            <div className="w-full">
            <div className="flex justify-between text-sm mb-1">
                <span>Ocupação</span>
                <span>{Math.round((turma.totalMembers / turma.capacity) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              {(() => {
                const ocupacao = (turma.totalMembers / turma.capacity) * 100;
                let bgColor = "bg-red-500";

                if (ocupacao <= 75) {
                  bgColor = "bg-green-500";
                } else if (ocupacao >= 75 && ocupacao < 90) {
                  bgColor = "bg-yellow-500";
                } else {
                  bgColor = "bg-red-500";
                }

                return (
                  <div 
                    className={`h-2 rounded-full ${bgColor}`} 
                    style={{ width: `${Math.min(100, ocupacao)}%` }}
                  />
                );
              })()}

            </div>
            </div>
            <div className="flex space-x-2">
              <EditClassGroupDialog
                turmaId={turmaId}
                defaultValues={{
                  title: turma.title,
                  description: turma.description,
                  capacity: turma.capacity,
                  modalityId: turma.modalityDTO.id,
                  startDate: turma.startDate,
                  endDate: turma.endDate,
                  autoGeneratedSessions: turma.autoGeneratedSessions,
                  isEvent: turma.isEvent
                }}
                onUpdated={() => {
                  // Recarregar os dados da turma após edição
                  ClassGroupService.getById(turmaId).then(setTurma);
                }}
              >
                <Button>Editar Turma</Button>
              </EditClassGroupDialog>
              <Button variant="outline">Enviar Aviso</Button>
            </div>
          </CardFooter>
        </Card>

        {/* Card de status */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-xl">Status da Turma</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Próxima Aula</p>
              <div className="p-3 bg-secondary rounded-lg">
                <p className="font-medium">Aula 12 - Técnicas Avançadas</p>
                <p className="text-sm text-muted-foreground">Quarta-feira, 15/05/2023 - 19:00</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Última Aula</p>
              <div className="p-3 bg-secondary rounded-lg">
                <p className="font-medium">Aula 11 - Fundamentos</p>
                <p className="text-sm text-muted-foreground">Segunda-feira, 13/05/2023 - 19:00</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Presenças</p>
              <div className="flex justify-between">
                <div className="text-center">
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-xs text-muted-foreground">Média</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Aulas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">20</p>
                  <p className="text-xs text-muted-foreground">Alunos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
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
          <TabsTrigger value="horarios" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Horários
          </TabsTrigger>
          <TabsTrigger value="aulas" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Aulas
          </TabsTrigger>
          {/* <TabsTrigger value="avaliacoes" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Avaliações
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="alunos" className="pt-4">
            {/* {turmaId && <StudentsTab classGroupId={turmaId} />} */}
            <StudentsTab classGroupId={turmaId} currentUserId={currentUserId} />

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


        <TabsContent value="avaliacoes" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Avaliações dos Alunos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Relatório de avaliações será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}