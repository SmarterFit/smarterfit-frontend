import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { withMask } from "use-mask-input";
import clsx from "clsx";
import {
   createUserSchema,
   CreateUserRequestDTO,
} from "@/backend/modules/useraccess/schemas/userSchemas";
import { RoleType } from "@/backend/common/enums/rolesEnum";
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
import { userService } from "@/backend/modules/useraccess/services/userServices";
import { toast } from "sonner";

type RegisterDialogProps = {
   open: boolean;
   setOpen: (open: boolean) => void;
   openLogin?: () => void;
};

export function RegisterDialog({
   open,
   setOpen,
   openLogin,
}: RegisterDialogProps) {
   const form = useForm<CreateUserRequestDTO>({
      resolver: zodResolver(createUserSchema),
      mode: "onChange",
      defaultValues: {
         name: "",
         email: "",
         password: "",
         confirmPassword: "",
         cpf: "",
         roles: [RoleType.MEMBER],
      },
   });

   const {
      control,
      handleSubmit,
      reset,
      formState: { errors, touchedFields },
   } = form;

   async function onSubmit(data: CreateUserRequestDTO) {
      try {
         await userService.create(data);
         toast("Usuário criado com sucesso!", {
            description: "Seja bem-vindo ao SmarterFit!",
            closeButton: true,
         });
         setOpen(false);
         reset();

         if (openLogin) {
            openLogin();
         }
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
            <Button className="cursor-pointer">Registrar</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-lg">
            <DialogHeader>
               <DialogTitle>Criar nova conta</DialogTitle>
               <DialogDescription>
                  Preencha os campos abaixo para criar seu usuário.
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-2"
               >
                  {/* Nome */}
                  <FormField
                     control={control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Nome</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Seu nome"
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
                  <div className="grid grid-cols-2 gap-2">
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

                     <FormField
                        control={control}
                        name="confirmPassword"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Confirmar Senha</FormLabel>
                              <FormControl>
                                 <Input
                                    type="password"
                                    placeholder="********"
                                    {...field}
                                    className={clsx(
                                       touchedFields.confirmPassword &&
                                          (errors.confirmPassword
                                             ? "border-red-500"
                                             : "border-green-500")
                                    )}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  {/* CPF com máscara */}
                  <FormField
                     control={control}
                     name="cpf"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>CPF</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="000.000.000-00"
                                 {...field}
                                 className={clsx(
                                    touchedFields.password &&
                                       (errors.password
                                          ? "border-red-500"
                                          : "border-green-500")
                                 )}
                                 ref={withMask("cpf")}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <DialogFooter className="flex justify-between">
                     {openLogin && (
                        <Button
                           variant="link"
                           onClick={() => {
                              setOpen(false);
                              openLogin();
                           }}
                        >
                           Já tenho conta
                        </Button>
                     )}
                     <Button type="submit" className="cursor-pointer">
                        Criar Conta
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
