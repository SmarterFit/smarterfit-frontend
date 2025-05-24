import { useEffect, useState } from "react";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileMetricResponseDTO } from "@/backend/modules/useraccess/types/profileMetricTypes";
import { profileMetricService } from "@/backend/modules/useraccess/services/profileMetricServices";
import {
   ProfileMetricType,
   ProfileMetricLabels,
} from "@/backend/common/enums/profileMetricEnum";
import { MetricForm } from "../forms/ProfileMetricForm";
import { CreateProfileMetricRequestDTO } from "@/backend/modules/useraccess/schemas/profileMetricSchemas";
import { LastMetricsChart } from "../charts/LastMetricsChart";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import { AreaMetricChart } from "../charts/AreaMetricChart";

interface MetricsTabProps {
   user?: UserResponseDTO | null;
   isLoading?: boolean;
}

export function MetricsTab({ user, isLoading }: MetricsTabProps) {
   const [lastMetrics, setLastMetrics] = useState<ProfileMetricResponseDTO[]>(
      []
   );
   const [allMetrics, setAllMetrics] = useState<
      Partial<Record<ProfileMetricType, ProfileMetricResponseDTO[]>>
   >({});
   const [loading, setLoading] = useState(false);
   const [submitting, setSubmitting] = useState(false);

   // Função para carregar todas as métricas
   const fetchMetrics = async (userId: string) => {
      setLoading(true);
      try {
         const lasts = await profileMetricService.getLasts(userId);
         setLastMetrics(lasts);

         const metricsByType: Partial<
            Record<ProfileMetricType, ProfileMetricResponseDTO[]>
         > = {};
         await Promise.all(
            Object.values(ProfileMetricType).map(async (type) => {
               const data = await profileMetricService.getByType(userId, type);
               if (data && data.length > 0) {
                  metricsByType[type] = data;
               }
            })
         );
         setAllMetrics(metricsByType);
      } catch (error) {
         // Pode adicionar tratamento de erro aqui, se quiser
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (!user) return;
      fetchMetrics(user.id);
   }, [user]);

   const handleMetricSubmit = async (data: CreateProfileMetricRequestDTO) => {
      if (!user) return;
      setSubmitting(true);
      try {
         await profileMetricService.create(user.id, data);
         SuccessToast(
            "Métrica cadastrada com sucesso!",
            "Você pode ver ela logo ali!"
         );
         // Atualiza os dados sem recarregar a página
         await fetchMetrics(user.id);
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setSubmitting(false);
      }
   };

   const hasAnyMetric = Object.keys(allMetrics).length > 0;
   const chartConfig = {};

   return (
      <div className="space-y-8">
         <section className="flex flex-col space-y-6 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold">Métricas</h2>
            <p className="text-muted-foreground text-sm">
               Visualize e registre suas métricas pessoais.
            </p>

            <Card>
               <CardHeader>
                  <CardTitle>Registrar Nova Métrica</CardTitle>
                  <CardDescription>
                     Mantenha suas métricas atualizadas.
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  {user ? (
                     <MetricForm
                        onSubmit={handleMetricSubmit}
                        loading={submitting}
                     />
                  ) : (
                     <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-6 w-1/3" />
                     </div>
                  )}
               </CardContent>
            </Card>

            {isLoading || loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, idx) => (
                     <Skeleton key={idx} className="h-40 w-full" />
                  ))}
               </div>
            ) : (
               <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     <Card>
                        <CardHeader>
                           <CardTitle>Últimas Métricas</CardTitle>
                           <CardDescription>
                              Suas últimas métricas registradas.
                           </CardDescription>
                        </CardHeader>
                        <CardContent>
                           {lastMetrics.length > 0 ? (
                              <LastMetricsChart
                                 data={lastMetrics}
                                 config={chartConfig}
                              />
                           ) : (
                              <Skeleton className="h-32 w-full" />
                           )}
                        </CardContent>
                     </Card>

                     {hasAnyMetric &&
                        Object.entries(allMetrics).map(([type, data]) => (
                           <Card key={type}>
                              <CardHeader>
                                 <CardTitle>
                                    {
                                       ProfileMetricLabels[
                                          type as ProfileMetricType
                                       ]
                                    }
                                 </CardTitle>
                                 <CardDescription>
                                    Última atualização:{" "}
                                    {new Date(
                                       data[0].createdAt
                                    ).toLocaleDateString("pt-BR")}
                                 </CardDescription>
                              </CardHeader>
                              <CardContent>
                                 <AreaMetricChart
                                    data={data}
                                    config={chartConfig}
                                 />
                              </CardContent>
                           </Card>
                        ))}
                  </div>

                  {!hasAnyMetric && (
                     <p className="text-muted-foreground">
                        Nenhuma métrica registrada ainda.
                     </p>
                  )}
               </>
            )}
         </section>
      </div>
   );
}
