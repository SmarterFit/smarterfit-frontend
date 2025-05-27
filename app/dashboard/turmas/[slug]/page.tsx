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

export default function TurmaPageClient() {
  const [turma, setTurma] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const id = localStorage.getItem("selectedTurmaId");
    if (!id) {
      router.push("/turmas");
      return;
    }

    setLoading(true);
    ClassGroupService.getById(id)
      .then(data => {
        if (!data) {
          router.push("/turmas");
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

  // Dados de exemplo (substituir por dados reais)
  const alunos = [
    { id: 1, nome: "João Silva", email: "joao@email.com", avatar: "", status: "ativo" },
    { id: 2, nome: "Maria Souza", email: "maria@email.com", avatar: "", status: "ativo" },
    { id: 3, nome: "Carlos Oliveira", email: "carlos@email.com", avatar: "", status: "inativo" },
  ];

  const planos = [
    { id: 1, nome: "Plano Mensal", valor: "R$ 200,00", duracao: "30 dias" },
    { id: 2, nome: "Plano Trimestral", valor: "R$ 550,00", duracao: "90 dias" },
  ];

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const ocupacao = Math.round((turma.totalMembers / turma.capacity) * 100);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Detalhes da Turma</h1>
        <Button variant="outline" onClick={() => router.push("/turmas")}>
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
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Horário</p>
                <p className="font-medium">Segunda e Quarta, 19:00-20:00</p>
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
                <div 
                className="bg-primary h-2 rounded-full" 
                style={{
                    width: `${Math.min(100, (turma.totalMembers / turma.capacity) * 100)}%`
                }}
                />
            </div>
            </div>
            <div className="flex space-x-2">
              <Button>Editar Turma</Button>
              <Button variant="outline">Enviar Aviso</Button>
            </div>
          </CardFooter>
        </Card>

        {/* Card de status */}
        <Card>
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
          <TabsTrigger value="aulas" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Aulas
          </TabsTrigger>
          <TabsTrigger value="avaliacoes" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Avaliações
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo da aba Alunos */}
        <TabsContent value="alunos" className="pt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Alunos Matriculados</CardTitle>
                <Button size="sm">Adicionar Aluno</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alunos.map((aluno) => (
                  <div key={aluno.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={aluno.avatar} />
                        <AvatarFallback>{aluno.nome.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{aluno.nome}</p>
                        <p className="text-sm text-muted-foreground">{aluno.email}</p>
                      </div>
                    </div>
                    <Badge variant={aluno.status === "ativo" ? "default" : "secondary"}>
                      {aluno.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conteúdo da aba Planos */}
        <TabsContent value="planos" className="pt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Planos Associados</CardTitle>
                <Button size="sm">Vincular Plano</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {planos.map((plano) => (
                  <Card key={plano.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{plano.nome}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold">{plano.valor}</p>
                      <p className="text-sm text-muted-foreground">{plano.duracao}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500">
                        Remover
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conteúdo das outras abas (vazios por enquanto) */}
        <TabsContent value="aulas" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendário de Aulas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Calendário de aulas será exibido aqui.</p>
            </CardContent>
          </Card>
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