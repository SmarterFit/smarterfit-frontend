import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogTrigger,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogFooter,
} from "@/components/ui/dialog";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
   LoginRequestDTO,
   loginRequestSchema,
} from "@/backend/modules/useraccess/schemas/authSchemas";
import { authService } from "@/backend/modules/useraccess/services/authServices";

export function LoginDialog({ openRegister }: { openRegister?: () => void }) {
   const [open, setOpen] = React.useState(false);
   const form = useForm<LoginRequestDTO>({
      resolver: zodResolver(loginRequestSchema),
      mode: "onChange",
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const {
      control,
      handleSubmit,
      reset,
      formState: { errors, touchedFields },
   } = form;

   async function onSubmit(data: LoginRequestDTO) {
      try {
         await authService.login(data);
         toast("Usuário logado com sucesso!", {
            description: "É um prazer te ver de volta 😊!",
            closeButton: true,
         });
         setOpen(false);
         reset();

         /// TODO: Redirecionar para o dashboard
      } catch (e: any) {
         toast("Ops, algo deu errado!", {
            description: e.message,
            closeButton: true,
         });
      }
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button className="cursor-pointer">Entrar</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-lg">
            <DialogHeader>
               <DialogTitle>Entrar no SmarterFit</DialogTitle>
               <DialogDescription>
                  Preencha os campos abaixo para entrar no SmarterFit.
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-2"
               >
                  {/* Email */}
                  <FormField
                     control={control}
                     name="email"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>E‑mail</FormLabel>
                           <FormControl>
                              <Input
                                 type="email"
                                 placeholder="seu@exemplo.com"
                                 {...field}
                                 className={clsx(
                                    touchedFields.password &&
                                       (errors.password
                                          ? "border-red-500"
                                          : "border-green-500")
                                 )}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Senhas lado a lado */}
                  <FormField
                     control={control}
                     name="password"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Senha</FormLabel>
                           <FormControl>
                              <Input
                                 type="password"
                                 placeholder="********"
                                 {...field}
                                 className={clsx(
                                    touchedFields.password &&
                                       (errors.password
                                          ? "border-red-500"
                                          : "border-green-500")
                                 )}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <DialogFooter className="flex justify-between">
                     {openRegister && (
                        <Button
                           variant="link"
                           onClick={() => {
                              setOpen(false);
                              openRegister();
                           }}
                        >
                           Não tenho uma conta
                        </Button>
                     )}
                     <Button type="submit" className="cursor-pointer">
                        Entrar
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
