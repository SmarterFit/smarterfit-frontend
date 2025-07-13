import { useEffect, useState } from "react";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricForm } from "../forms/ProfileMetricForm";
import { LastMetricsChart } from "../charts/LastMetricsChart";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { metricTypeService } from "@/backend/modules/useraccess/services/metricTypesService";
import { userMetricService } from "@/backend/modules/useraccess/services/userMetricService";
import { CreateProfileMetricRequestDTO } from "@/backend/modules/useraccess/schemas/profileMetricSchemas";
import { MetricTypeResponseDTO } from "@/backend/modules/useraccess/types/profileMetricTypes";
import { MetricDataResponseDTO } from "@/backend/modules/useraccess/types/userMetricTypes";

import { Loader2, ListChecks } from "lucide-react";

interface MetricsTabProps {
   user?: UserResponseDTO | null;
   isLoading?: boolean;
}

export function MetricsTab({ user, isLoading }: MetricsTabProps) {
   const [lastMetrics, setLastMetrics] = useState<any[]>([]);
   const [metricTypes, setMetricTypes] = useState<MetricTypeResponseDTO[]>([]);

   const [loading, setLoading] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [importLoading, setImportLoading] = useState(false);

   const [importFile, setImportFile] = useState<File | null>(null);
   const [selectedMetricType, setSelectedMetricType] = useState<string | undefined>(undefined);

   const [selectedListType, setSelectedListType] = useState<string | undefined>();
   const [listedMetrics, setListedMetrics] = useState<MetricDataResponseDTO[]>([]);
   const [listingLoading, setListingLoading] = useState(false);


   const fetchMetricsByType = async (type: string) => {
      setListingLoading(true);
      try {
         const data = await userMetricService.getByTypeName(type);
         setListedMetrics(data);
      } catch (e: any) {
         ErrorToast("Erro ao listar métricas.");
      } finally {
         setListingLoading(false);
      }
   };

   useEffect(() => {
      if (!user) return;
      const loadAllData = async () => {
         try {
            const types = await metricTypeService.getAll();
            setMetricTypes(types);
            await fetchMetrics(user.id);
         } catch (error) {
            ErrorToast("Erro ao carregar dados iniciais das métricas.");
         }
      };

      loadAllData();
   }, [user]);

   const fetchMetrics = async (userId: string) => {
      setLoading(true);
      try {
         const data = await userMetricService.getLasts(userId);
         setLastMetrics(data);
      } catch (error) {
         ErrorToast("Erro ao carregar métricas...");
      } finally {
         setLoading(false);
      }
   };


   const handleMetricSubmit = async (data: CreateProfileMetricRequestDTO) => {
      if (!user) return;
      setSubmitting(true);
      try {
         await userMetricService.addMetric(data);
         SuccessToast("Métrica cadastrada com sucesso!", "");
         await fetchMetrics(user.id);
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setSubmitting(false);
      }
   };

   const handleImport = async () => {
      if (!user || !selectedMetricType || !importFile) return;
      try {
         setImportLoading(true);
         await userMetricService.importMetrics(importFile, selectedMetricType, user.id);
         SuccessToast("Importação feita com sucesso!", "");
         await fetchMetrics(user.id);
         setImportFile(null);
         setSelectedMetricType(undefined);
      } catch (e: any) {
         ErrorToast(e.message || "Erro ao importar métricas");
      } finally {
         setImportLoading(false);
      }
   };

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
                  <CardDescription>Mantenha suas métricas atualizadas.</CardDescription>
               </CardHeader>
               <CardContent>
                  {user ? (
                     <MetricForm onSubmit={handleMetricSubmit} loading={submitting} />
                  ) : (
                     <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-6 w-1/3" />
                     </div>
                  )}
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Importar Métricas via Arquivo</CardTitle>
                  <CardDescription>
                     Envie um arquivo <strong>CSV</strong> ou <strong>JSON</strong> com valores numéricos para um tipo de métrica específico.
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                     <div>
                        <label className="block text-sm font-medium mb-1">Tipo de Métrica</label>
                        <Select onValueChange={setSelectedMetricType} value={selectedMetricType ?? ""}>
                           <SelectTrigger>
                              <SelectValue placeholder="Selecione um tipo" />
                           </SelectTrigger>
                           <SelectContent>
                              {metricTypes.map((type) => (
                                 <SelectItem key={type.id} value={type.type}>
                                    {type.type} ({type.unit})
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>

                     <div>
                        <label className="block text-sm font-medium mb-1">Arquivo (.csv ou .json)</label>
                        <Input
                           type="file"
                           accept=".csv, application/json"
                           onChange={(e) => {
                              if (e.target.files?.[0]) {
                                 setImportFile(e.target.files[0]);
                              }
                           }}
                        />
                     </div>
                  </div>

                  <Button
                     onClick={handleImport}
                     disabled={!user || !selectedMetricType || !importFile || importLoading}
                  >
                     {importLoading ? "Importando..." : "Importar Arquivo"}
                  </Button>
               </CardContent>
            </Card>

            <Card className="shadow-md">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                     <ListChecks className="w-5 h-5 text-primary" />
                     Listar Métricas por Tipo
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                     Escolha um tipo de métrica para visualizar registros anteriores.
                  </CardDescription>
               </CardHeader>

               <CardContent className="space-y-6">
                  <Select
                     onValueChange={(value) => {
                        setSelectedListType(value);
                        fetchMetricsByType(value);
                     }}
                     value={selectedListType ?? ""}
                  >
                     <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um tipo de métrica" />
                     </SelectTrigger>
                     <SelectContent>
                        {metricTypes.map((type) => (
                           <SelectItem key={type.id} value={type.type}>
                              {type.type} ({type.unit})
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>

                  {listingLoading ? (
                     <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-muted-foreground w-6 h-6" />
                     </div>
                  ) : listedMetrics.length > 0 ? (
                     <div className="space-y-4">
                        {listedMetrics.map((metric) => (
                           <div
                              key={metric.id}
                              className="p-4 border rounded-xl bg-muted/40 hover:bg-muted/30 transition-shadow"
                           >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                 {Object.entries(metric.data).map(([key, value]) => (
                                    <div key={key} className="flex flex-col">
                                       <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                          {key}
                                       </span>
                                       <span className="font-medium text-foreground">{value}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : selectedListType ? (
                     <p className="text-center text-muted-foreground text-sm">
                        Nenhuma métrica registrada para este tipo.
                     </p>
                  ) : null}
               </CardContent>
            </Card>

            {isLoading || loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, idx) => (
                     <Skeleton key={idx} className="h-40 w-full" />
                  ))}
               </div>
            ) : (
               <Card>
                  <CardHeader>
                     <CardTitle>Últimas Métricas</CardTitle>
                     <CardDescription>Suas últimas métricas registradas.</CardDescription>
                  </CardHeader>
                  <CardContent>
                     {lastMetrics.length > 0 ? (
                        <LastMetricsChart data={lastMetrics} config={chartConfig} />
                     ) : (
                        <Skeleton className="h-32 w-full" />
                     )}
                  </CardContent>
               </Card>
            )}
         </section>
      </div>
   );
}
