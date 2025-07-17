import { useEffect, useMemo, useState } from "react";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "@/components/ui/card";
import {
   Table,
   TableHeader,
   TableRow,
   TableHead,
   TableBody,
   TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricForm } from "../forms/ProfileMetricForm"; // Mantido
import { ErrorToast, SuccessToast } from "../toasts/Toasts";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userMetricService } from "@/backend/modules/useraccess/services/userMetricService";
import { Loader2, Search } from "lucide-react";
import { MetricDataResponseDTO } from "@/backend/modules/useraccess/types/userMetricTypes";
import { MetricDataRequestDTO } from "@/backend/modules/useraccess/schemas/userMetricSchemas";

interface MetricsTabProps {
   user?: UserResponseDTO | null;
}

const METRIC_TYPE_TO_DISPLAY = "Créditos de Educação";
const ITEMS_PER_PAGE = 5;

export function MetricsTab({ user }: MetricsTabProps) {
   // --- ESTADOS ---
   // Estado para os dados da tabela
   const [educationMetrics, setEducationMetrics] = useState<
      MetricDataResponseDTO[]
   >([]);
   // Estados para carregamento e submissão
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   // Estados para busca e paginação da tabela
   const [searchTerm, setSearchTerm] = useState("");
   const [currentPage, setCurrentPage] = useState(1);

   // --- FUNÇÕES DE BUSCA ---
   const fetchEducationMetrics = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
         const data = await userMetricService.getByTypeName(
            METRIC_TYPE_TO_DISPLAY
         );
         setEducationMetrics(data);
      } catch (error) {
         ErrorToast("Erro ao carregar os créditos de educação.");
      } finally {
         setIsLoading(false);
      }
   };

   // Carrega os dados quando o usuário estiver disponível
   useEffect(() => {
      fetchEducationMetrics();
   }, [user]);

   // --- FUNÇÃO DE SUBMISSÃO ---
   const handleMetricSubmit = async (data: MetricDataRequestDTO) => {
      if (!user) return;
      setIsSubmitting(true);
      try {
         await userMetricService.addMetric(data);
         SuccessToast("Métrica cadastrada com sucesso!", "Sucesso!");
         // Recarrega a tabela após o cadastro
         await fetchEducationMetrics();
      } catch (e: any) {
         ErrorToast(e.message || "Erro ao registrar métrica.");
      } finally {
         setIsSubmitting(false);
      }
   };

   // --- LÓGICA DE FILTRO E PAGINAÇÃO ---
   const filteredMetrics = useMemo(() => {
      if (!searchTerm) {
         return educationMetrics;
      }
      return educationMetrics.filter((metric) =>
         JSON.stringify(metric).toLowerCase().includes(searchTerm.toLowerCase())
      );
   }, [educationMetrics, searchTerm]);

   const totalPages = Math.ceil(filteredMetrics.length / ITEMS_PER_PAGE);
   const paginatedMetrics = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return filteredMetrics.slice(startIndex, startIndex + ITEMS_PER_PAGE);
   }, [filteredMetrics, currentPage]);

   // Gera os cabeçalhos da tabela dinamicamente a partir dos dados
   const tableHeaders = useMemo(() => {
      if (educationMetrics.length === 0) return [];
      // Pega as chaves do objeto 'data' do primeiro item e adiciona a coluna de data de criação
      return [...Object.keys(educationMetrics[0].data), "Data de Criação"];
   }, [educationMetrics]);

   return (
      <div className="space-y-8">
         <section className="flex flex-col space-y-6 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold">Métricas</h2>
            <p className="text-muted-foreground text-sm">
               Visualize e registre suas métricas pessoais.
            </p>

            {/* Card para registrar nova métrica (mantido) */}
            <Card>
               <CardHeader>
                  <CardTitle>Registrar Novos Créditos de Educação</CardTitle>
                  <CardDescription>
                     Mantenha seus créditos atualizados.
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  {user ? (
                     <MetricForm
                        onSubmit={handleMetricSubmit}
                        loading={isSubmitting}
                     />
                  ) : (
                     <Skeleton className="h-48 w-full" />
                  )}
               </CardContent>
            </Card>

            {/* Card com a Tabela de Créditos de Educação */}
            <Card className="shadow-md">
               <CardHeader>
                  <CardTitle>Histórico de Créditos de Educação</CardTitle>
                  <CardDescription>
                     Visualize todos os seus registros de créditos de educação.
                  </CardDescription>
               </CardHeader>

               <CardContent className="space-y-4">
                  <div className="relative">
                     <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input
                        type="search"
                        placeholder="Buscar em todos os campos..."
                        className="pl-8 sm:w-1/3"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>

                  {isLoading ? (
                     <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-muted-foreground w-8 h-8" />
                     </div>
                  ) : paginatedMetrics.length > 0 ? (
                     <>
                        <div className="border rounded-md">
                           <Table>
                              <TableHeader>
                                 <TableRow>
                                    <TableHead>Instituição</TableHead>
                                    <TableHead>Horas</TableHead>
                                    <TableHead>Curso</TableHead>
                                    <TableHead>Data de Conclusão</TableHead>
                                    <TableHead>Data de Inserção</TableHead>
                                 </TableRow>
                              </TableHeader>
                              <TableBody>
                                 {paginatedMetrics.map((metric) => (
                                    <TableRow key={metric.id}>
                                       <TableCell>
                                          {metric.data.institution}
                                       </TableCell>
                                       <TableCell>{`${metric.data.hours} h`}</TableCell>

                                       <TableCell>
                                          {metric.data.courseName}
                                       </TableCell>
                                       <TableCell>
                                          {new Date(
                                             metric.data.completionDate
                                          ).toLocaleDateString("pt-BR", {
                                             timeZone: "UTC",
                                          })}
                                       </TableCell>

                                       <TableCell>
                                          {new Date(
                                             metric.createdAt
                                          ).toLocaleDateString("pt-BR")}
                                       </TableCell>
                                    </TableRow>
                                 ))}
                              </TableBody>
                           </Table>
                        </div>

                        {/* Controles de Paginação */}
                        <div className="flex items-center justify-end space-x-2 py-4">
                           <span className="text-sm text-muted-foreground">
                              Página {currentPage} de {totalPages}
                           </span>
                           <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                 setCurrentPage((prev) => Math.max(prev - 1, 1))
                              }
                              disabled={currentPage === 1}
                           >
                              Anterior
                           </Button>
                           <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                 setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                 )
                              }
                              disabled={currentPage === totalPages}
                           >
                              Próxima
                           </Button>
                        </div>
                     </>
                  ) : (
                     <p className="py-10 text-center text-muted-foreground text-sm">
                        Nenhum crédito de educação encontrado.
                     </p>
                  )}
               </CardContent>
            </Card>
         </section>
      </div>
   );
}
