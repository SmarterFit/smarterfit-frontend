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
import {
   LoginRequestDTO,
   loginRequestSchema,
} from "@/backend/modules/useraccess/schemas/authSchemas";
import { authService } from "@/backend/modules/useraccess/services/authServices";
import { AuthResponseDTO } from "@/backend/modules/useraccess/types/authTypes";
import Cookies from "js-cookie";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";

type LoginDialogProps = {
   open: boolean;
   setOpen: (open: boolean) => void;
   openRegister?: () => void;
};

export function LoginDialog({ open, setOpen, openRegister }: LoginDialogProps) {
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
         const response: AuthResponseDTO = await authService.login(data);
         SuccessToast("Login efetuado com sucesso!", "Seja bem-vindo!");
         setOpen(false);
         reset();

         Cookies.set("token", response.accessToken.token, { expires: 7 });
         Cookies.set("userId", response.user.id, { expires: 7 });
         localStorage.setItem("user", JSON.stringify(response.user));

         window.location.href = "/dashboard";
      } catch (e: any) {
         ErrorToast(e.message);
      }
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button className="cursor-pointer">Entrar</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-lg">
            <DialogHeader>
               <DialogTitle>Entrar no HUBpro</DialogTitle>
               <DialogDescription>
                  Preencha os campos abaixo para entrar no HUBpro.
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
