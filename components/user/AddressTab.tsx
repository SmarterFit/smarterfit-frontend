import {
   CreateAddressRequestDTO,
   createAddressSchema,
} from "@/backend/modules/useraccess/schemas/addressSchemas";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";
import { Loader2, MapPin } from "lucide-react";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { fetchAddressByCep } from "@/lib/viacep";
import { addressService } from "@/backend/modules/useraccess/services/addressServices";
import { AddressResponseDTO } from "@/backend/modules/useraccess/types/addressTypes";
import { withMask } from "use-mask-input";

interface AddressTabProps {
   user?: UserResponseDTO | null;
   isLoading?: boolean;
   onAddressUpdated?: (address: AddressResponseDTO) => void;
}

export function AddressTab({
   user,
   isLoading,
   onAddressUpdated,
}: AddressTabProps) {
   const [submittingAddress, setSubmittingAddress] = useState(false);
   const [disabledFields, setDisabledFields] = useState<
      Record<string, boolean>
   >({});

   const form = useForm<CreateAddressRequestDTO>({
      resolver: zodResolver(createAddressSchema),
      mode: "onChange",
      defaultValues: {
         street: user?.profile?.address?.street || "",
         number: user?.profile?.address?.number || "",
         neighborhood: user?.profile?.address?.neighborhood || "",
         city: user?.profile?.address?.city || "",
         cep: user?.profile?.address?.cep || "",
         state: user?.profile?.address?.state || "",
      },
   });

   const {
      control,
      handleSubmit,
      watch,
      setValue,
      formState: { errors, touchedFields },
      reset,
   } = form;

   const cepValue = watch("cep");

   useEffect(() => {
      const handleCepSearch = async () => {
         if (/^\d{5}-\d{3}$/.test(cepValue)) {
            try {
               const addressData = await fetchAddressByCep(cepValue);
               if (addressData) {
                  if (addressData.logradouro) {
                     setValue("street", addressData.logradouro);
                  }
                  if (addressData.bairro) {
                     setValue("neighborhood", addressData.bairro);
                  }
                  if (addressData.localidade) {
                     setValue("city", addressData.localidade);
                  }
                  if (addressData.uf) {
                     setValue("state", addressData.uf);
                  }

                  setDisabledFields({
                     street: !!addressData.logradouro,
                     neighborhood: !!addressData.bairro,
                     city: !!addressData.localidade,
                     state: !!addressData.uf,
                  });

                  SuccessToast(
                     "Endereço encontrado!",
                     "Os campos foram preenchidos automaticamente."
                  );
               } else {
                  // Endereço não encontrado: reabilita os campos
                  setDisabledFields({
                     street: false,
                     neighborhood: false,
                     city: false,
                     state: false,
                  });
                  ErrorToast("CEP não encontrado.");
               }
            } catch {
               setDisabledFields({
                  street: false,
                  neighborhood: false,
                  city: false,
                  state: false,
               });
               ErrorToast("Erro ao buscar CEP.");
            }
         } else {
            // CEP inválido: reabilita os campos
            setDisabledFields({
               street: false,
               neighborhood: false,
               city: false,
               state: false,
            });
         }
      };

      handleCepSearch();
   }, [cepValue, setValue]);

   const handleAddressSubmit = async (data: CreateAddressRequestDTO) => {
      if (!user) return;
      setSubmittingAddress(true);
      try {
         let updated: AddressResponseDTO;
         if (user.profile?.address) {
            updated = await addressService.updateByProfileId(user.id, data);
         } else {
            updated = await addressService.create(user.id, data);
         }
         SuccessToast("Endereço atualizado!", "Seu endereço foi alterado.");
         onAddressUpdated?.(updated);
         reset(data);
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setSubmittingAddress(false);
      }
   };

   if (isLoading || !user) {
      return (
         <div className="space-y-8">
            <section className="flex flex-col space-y-4 p-6 border rounded-lg">
               <Skeleton className="h-8 w-1/3" />
               <Skeleton className="h-4 w-2/3" />
               {[...Array(6)].map((_, idx) => (
                  <Skeleton key={idx} className="h-10 w-full" />
               ))}
               <Skeleton className="h-10 w-32" />
            </section>
         </div>
      );
   }

   return (
      <div className="space-y-8">
         <section className="flex flex-col space-y-6 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold flex items-center">
               Endereço
               <MapPin className="ml-2 h-5 w-5 text-muted-foreground" />
            </h2>
            <p className="text-muted-foreground text-sm">
               Atualize seu endereço para manter suas informações em dia.
            </p>

            <Form {...form}>
               <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  onSubmit={handleSubmit(handleAddressSubmit)}
               >
                  <FormField
                     control={control}
                     name="cep"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>CEP</FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 placeholder="XXXXX-XXX"
                                 ref={withMask("99999-999")}
                                 className={
                                    touchedFields.cep
                                       ? errors.cep
                                          ? "border-destructive focus-visible:ring-destructive"
                                          : "border-green-500 focus-visible:ring-green-500"
                                       : ""
                                 }
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={control}
                     name="street"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Logradouro</FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 disabled={disabledFields.street}
                                 className={
                                    touchedFields.street
                                       ? errors.street
                                          ? "border-destructive focus-visible:ring-destructive"
                                          : "border-green-500 focus-visible:ring-green-500"
                                       : ""
                                 }
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={control}
                     name="number"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Número</FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 className={
                                    touchedFields.number
                                       ? errors.number
                                          ? "border-destructive focus-visible:ring-destructive"
                                          : "border-green-500 focus-visible:ring-green-500"
                                       : ""
                                 }
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={control}
                     name="neighborhood"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Bairro</FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 disabled={disabledFields.neighborhood}
                                 className={
                                    touchedFields.neighborhood
                                       ? errors.neighborhood
                                          ? "border-destructive focus-visible:ring-destructive"
                                          : "border-green-500 focus-visible:ring-green-500"
                                       : ""
                                 }
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={control}
                     name="city"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Cidade</FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 disabled={disabledFields.city}
                                 className={
                                    touchedFields.city
                                       ? errors.city
                                          ? "border-destructive focus-visible:ring-destructive"
                                          : "border-green-500 focus-visible:ring-green-500"
                                       : ""
                                 }
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={control}
                     name="state"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Estado</FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 disabled={disabledFields.state}
                                 className={
                                    touchedFields.state
                                       ? errors.state
                                          ? "border-destructive focus-visible:ring-destructive"
                                          : "border-green-500 focus-visible:ring-green-500"
                                       : ""
                                 }
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <div className="md:col-span-2 flex justify-end">
                     <Button type="submit" disabled={submittingAddress}>
                        {submittingAddress && (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Atualizar Endereço
                     </Button>
                  </div>
               </form>
            </Form>
         </section>
      </div>
   );
}
