"use client";

import Button from "@/components/base/Button";
import Form from "@/components/base/form/Form";
import Input from "@/components/base/form/Input";
import Modal from "@/components/base/containers/modal/Modal";
import { Mail, SquareAsterisk } from "lucide-react";
import { useState } from "react";
import { ApiRequestError } from "@/lib/exceptions/ApiRequestError";
import { useNotifications } from "@/components/base/notifications/NotificationsContext";
import { loginUser } from "@/lib/services/useraccess/userService";

type ModalLoginProps = {
   isOpen: boolean;
   onClose: () => void;
   openRegisterModal: () => void;
};

export default function ModalLogin({
   isOpen,
   onClose,
   openRegisterModal,
}: ModalLoginProps) {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
   });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   const { addNotification } = useNotifications();

   const handleLogin = async () => {
      try {
         const response = await loginUser(formData);

         // Salvar token e dados do usuário
         localStorage.setItem("token", response.accessToken.token);
         localStorage.setItem("tokenType", response.accessToken.type);
         localStorage.setItem(
            "tokenExpiresIn",
            response.accessToken.expiresIn.toString()
         );
         localStorage.setItem("user", JSON.stringify(response.user));

         // Notificação de sucesso
         addNotification({
            type: "success",
            title: "Login realizado com sucesso",
            message: "Você está conectado.",
         });

         onClose();
      } catch (error) {
         if (error instanceof ApiRequestError) {
            if (error.apiError.errors) {
               error.apiError.errors.forEach((err) => {
                  addNotification({
                     type: "error",
                     title: "Erro ao logar",
                     message: err,
                  });
               });
            }
         } else {
            addNotification({
               type: "error",
               title: "Erro ao logar",
               message: "Houve um problema ao logar. Tente novamente.",
            });
         }
      }
   };

   return (
      <Modal isOpen={isOpen} onClose={onClose} title="Login">
         <div className="space-y-6 px-2">
            <Form
               method="POST"
               onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
               }}
            >
               <Input
                  icon={<Mail />}
                  placeholder="Email"
                  type="email"
                  name="email"
                  onChange={handleChange}
                  required
               />
               <Input
                  icon={<SquareAsterisk />}
                  placeholder="Senha"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  required
               />
               <Button
                  variant="secondary"
                  className="p-2 hover:bg-accent/80"
                  type="submit"
               >
                  Entrar
               </Button>
            </Form>
            <div className="text-center">
               <p className="text-sm">
                  Não possui uma conta?{" "}
                  <span
                     className="text-accent cursor-pointer hover:underline"
                     onClick={() => {
                        onClose();
                        openRegisterModal();
                     }}
                  >
                     Cadastre-se
                  </span>
               </p>
            </div>
         </div>
      </Modal>
   );
}
