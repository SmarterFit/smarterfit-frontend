"use client";
import React, { useEffect, useState } from "react";

import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardHeader,
   CardTitle,
   CardContent,
   CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ListChecks } from "lucide-react";
import { SuccessToast, ErrorToast } from "@/components/toasts/Toasts";
import { metricTypeService } from "@/backend/modules/useraccess/services/metricTypesService";
import { userMetricService } from "@/backend/modules/useraccess/services/userMetricService";
import type { MetricTypeResponseDTO } from "@/backend/modules/useraccess/types/profileMetricTypes";
import type { MetricDataResponseDTO } from "@/backend/modules/useraccess/types/userMetricTypes";
import { MetricDataRequestDTO } from "@/backend/modules/useraccess/schemas/userMetricSchemas";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import { GradeForm } from "../forms/ProfileMetricForm";
import { LastMetricsChart } from "../charts/LastMetricsChart";

interface MetricsTabProps {
   user?: UserResponseDTO | null;
   isLoading?: boolean;
   classGroupId: string;
   isNonMember: boolean;
}

export function MetricsTab({
   user,
   isLoading,
   classGroupId,
   isNonMember,
}: MetricsTabProps) {
   const [gradeMetrics, setGradeMetrics] = useState<MetricDataResponseDTO[]>(
      []
   );
   const [metricTypes, setMetricTypes] = useState<MetricTypeResponseDTO[]>([]);
   const [loading, setLoading] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [importLoading, setImportLoading] = useState(false);
   const [importFile, setImportFile] = useState<File | null>(null);
   const [selectedMetricType, setSelectedMetricType] = useState<
      string | undefined
   >(undefined);
   const [selectedListType, setSelectedListType] = useState<
      string | undefined
   >();
   const [listedMetrics, setListedMetrics] = useState<MetricDataResponseDTO[]>(
      []
   );
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

   const fetchMetrics = async () => {
      setLoading(true);
      try {
         const data = await userMetricService.getByTypeName("Nota");
         const filteredData = data.filter(
            (metric) => metric.data && metric.data.classGroupId === classGroupId
         );
         const totalMetrics = filteredData.length;
         const adjustedData = filteredData.map((metric, index) => ({
            metricType: `${metric.metricType} ${index + 1}/${totalMetrics}`,
         }));
         setGradeMetrics(filteredData);
      } catch (error) {
         ErrorToast("Erro ao carregar métricas...");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (!user) return;
      const loadInitialData = async () => {
         try {
            const types = await metricTypeService.getAll();
            setMetricTypes(types);
            if (!isNonMember) {
               await fetchMetrics();
            }
         } catch (error) {
            ErrorToast("Erro ao carregar dados iniciais das métricas.");
         }
      };
      loadInitialData();
   }, [user, isNonMember]);

   const handleMetricSubmit = async (data: MetricDataRequestDTO) => {
      if (!user) return;
      setSubmitting(true);
      try {
         await userMetricService.addMetric(data);
         SuccessToast("Métrica cadastrada com sucesso!", "");
         if (!isNonMember) await fetchMetrics();
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setSubmitting(false);
      }
   };

   const handleImport = async () => {
      if (!user || !selectedMetricType || !importFile) return;
      setImportLoading(true);
      try {
         await userMetricService.importMetrics(importFile, selectedMetricType);
         SuccessToast("Importação feita com sucesso!", "");
         if (!isNonMember) await fetchMetrics();
         setImportFile(null);
         setSelectedMetricType(undefined);
      } catch (e: any) {
         ErrorToast(e.message || "Erro ao importar métricas");
      } finally {
         setImportLoading(false);
      }
   };

   if (isNonMember) {
      return (
         <div className="space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle>Registrar Nova Nota</CardTitle>
                  <CardDescription>
                     Registre uma nota para um aluno da turma.
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <GradeForm
                     onSubmit={handleMetricSubmit}
                     loading={submitting}
                     classGroupId={classGroupId}
                  />
               </CardContent>
            </Card>
            <Card>
               <CardHeader>
                  <CardTitle>Importar Métricas via Arquivo</CardTitle>
                  <CardDescription>
                     Envie um arquivo <strong>CSV</strong> ou{" "}
                     <strong>JSON</strong> para um tipo de métrica.
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        {/* CORREÇÃO: Substituído <FormLabel> por <label> padrão do HTML com estilo. */}
                        <label className="text-sm font-medium leading-none block mb-2">
                           Tipo de Métrica
                        </label>
                        <Select
                           onValueChange={setSelectedMetricType}
                           value={selectedMetricType ?? ""}
                        >
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
                        {/* CORREÇÃO: Substituído <FormLabel> por <label> padrão do HTML com estilo. */}
                        <label className="text-sm font-medium leading-none block mb-2">
                           Arquivo (.csv ou .json)
                        </label>
                        <Input
                           type="file"
                           accept=".csv, application/json"
                           onChange={(e) =>
                              e.target.files?.[0] &&
                              setImportFile(e.target.files[0])
                           }
                        />
                     </div>
                  </div>
                  <Button
                     onClick={handleImport}
                     disabled={
                        !selectedMetricType || !importFile || importLoading
                     }
                  >
                     {importLoading ? "Importando..." : "Importar Arquivo"}
                  </Button>
               </CardContent>
            </Card>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-primary" />
                  Listar Métricas por Tipo
               </CardTitle>
               <CardDescription>
                  Escolha um tipo para visualizar registros anteriores.
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <Select
                  onValueChange={(value) => {
                     setSelectedListType(value);
                     fetchMetricsByType(value);
                  }}
                  value={selectedListType ?? ""}
               >
                  <SelectTrigger>
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
                  <div className="space-y-3">
                     {listedMetrics.map((metric) => (
                        <div
                           key={metric.id}
                           className="p-3 border rounded-lg bg-muted/40"
                        >
                           <div className="grid grid-cols-2 gap-2 text-sm">
                              {Object.entries(metric.data).map(
                                 ([key, value]) => (
                                    <div key={key} className="flex flex-col">
                                       <span className="text-xs text-muted-foreground uppercase">
                                          {key}
                                       </span>
                                       <span className="font-medium">
                                          {String(value)}
                                       </span>
                                    </div>
                                 )
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               ) : selectedListType ? (
                  <p className="text-center text-muted-foreground text-sm py-4">
                     Nenhuma métrica registrada para este tipo.
                  </p>
               ) : null}
            </CardContent>
         </Card>
         <Card>
            <CardHeader>
               <CardTitle>Últimas Métricas Registradas</CardTitle>
               <CardDescription>
                  Visualização das suas últimas métricas.
               </CardDescription>
            </CardHeader>
            <CardContent>
               {loading ? (
                  <Skeleton className="h-40 w-full" />
               ) : gradeMetrics.length > 0 ? (
                  <LastMetricsChart data={gradeMetrics} config={{}} />
               ) : (
                  <p className="text-center text-muted-foreground text-sm py-4">
                     Nenhuma métrica recente para exibir.
                  </p>
               )}
            </CardContent>
         </Card>
      </div>
   );
}
