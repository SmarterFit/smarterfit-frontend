"use client";

import Button from "@/components/base/buttons/Button";
import Form from "@/components/base/form/Form";
import Input from "@/components/base/form/Input";
import Modal from "@/components/base/containers/modal/Modal";
import { Mail, SquareAsterisk } from "lucide-react";
import { useState } from "react";
import { ApiRequestError } from "@/lib/exceptions/ApiRequestError";
import { useNotifications } from "@/components/base/notifications/NotificationsContext";
import { loginUser } from "@/lib/services/useraccess/authService";
import { useRouter } from "next/navigation";
import { isEmail, isPassword } from "@/lib/validations/userValidations";

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

   // Atualiza o estado do campo a partir do input controlado
   const updateField = (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   const { addNotification } = useNotifications();
   const router = useRouter();

   // Essa função será chamada se o Form (por meio do contexto de validação) confirmar que os inputs estão válidos.
   const handleLogin = async () => {
      try {
         const response = await loginUser(formData);

         // Salva token e dados do usuário
         localStorage.setItem("token", response.accessToken.token);
         localStorage.setItem("tokenType", response.accessToken.type);
         localStorage.setItem("user", JSON.stringify(response.user));

         addNotification({
            type: "success",
            title: "Login realizado com sucesso",
            message: "Você está conectado.",
         });

         // Limpa o formulário
         setFormData({
            email: "",
            password: "",
         });

         onClose();
         router.push("/dashboard");
      } catch (error) {
         if (error instanceof ApiRequestError) {
            if (error.apiError.errors) {
               error.apiError.errors.forEach((err: string) => {
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
                  value={formData.email}
                  setValue={(val) => updateField("email", val)}
                  required
                  validationRules={[
                     {
                        validate: (value) => !!value,
                        message: "Email é obrigatório",
                     },
                     {
                        validate: (value) => isEmail(value),
                        message: "Email inválido",
                     },
                  ]}
               />
               <Input
                  icon={<SquareAsterisk />}
                  placeholder="Senha"
                  type="password"
                  name="password"
                  value={formData.password}
                  setValue={(val) => updateField("password", val)}
                  required
                  validationRules={[
                     {
                        validate: (value) => !!value,
                        message: "Senha é obrigatória",
                     },
                     {
                        validate: (value) => isPassword(value),
                        message: "Senha deve ter no mínimo 8 caracteres",
                     },
                  ]}
               />
               <Button
                  variant="secondary"
                  className="hover:bg-accent/80"
                  type="submit"
               >
                  Entrar
               </Button>
            </Form>
            <div className="text-center">
               <p className="text-sm">
                  Não possui uma conta?{" "}
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
