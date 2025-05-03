"use client";

import { useState } from "react";
import { registerUser } from "@/lib/services/useraccess/userService";
import Button from "@/components/base/Button";
import Form from "@/components/base/form/Form";
import Input from "@/components/base/form/Input";
import Modal from "@/components/base/containers/modal/Modal";
import { IdCard, Mail, SquareAsterisk, User } from "lucide-react";
import InputGroup from "@/components/base/form/InputGroup";
import { useNotifications } from "@/components/base/notifications/NotificationsContext";
import { ApiRequestError } from "@/lib/exceptions/ApiRequestError";
import { isCPF, isEmail } from "@/lib/validations/userValidations";

type ModalRegisterProps = {
   isOpen: boolean;
   onClose: () => void;
   openLoginModal: () => void;
};

export default function ModalRegister({
   isOpen,
   onClose,
   openLoginModal,
}: ModalRegisterProps) {
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      cpf: "",
      password: "",
      confirmPassword: "",
      roles: ["CUSTOMER"],
   });

   const [nameFields, setNameFields] = useState({
      firstName: "",
      lastName: "",
   });

   const { addNotification } = useNotifications();

   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNameFields((prev) => ({ ...prev, [name]: value }));
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   const handleRegister = async () => {
      const fullName = `${nameFields.firstName.trim()} ${nameFields.lastName.trim()}`;

      try {
         await registerUser({ ...formData, name: fullName });

         // Notificação de sucesso via notificações globais
         addNotification({
            type: "success",
            title: "Conta criada com sucesso",
            message: "Sua conta foi criada com sucesso.",
         });

         onClose();
         openLoginModal();
      } catch (error) {
         // Notificação de erro via notificações globais
         if (error instanceof ApiRequestError) {
            if (error.apiError.errors) {
               error.apiError.errors.forEach((err) => {
                  addNotification({
                     type: "error",
                     title: "Erro ao registrar",
                     message: err,
                  });
               });
            }
         } else {
            addNotification({
               type: "error",
               title: "Erro ao registrar",
               message: "Houve um problema ao registrar. Tente novamente.",
            });
         }
      }
   };

   return (
      <Modal isOpen={isOpen} onClose={onClose} title="Registre-se">
         <div className="space-y-6 px-2">
            <Form
               method="POST"
               onSubmit={(e) => {
                  e.preventDefault();
                  handleRegister();
               }}
            >
               {/* Nome e sobrenome */}
               <InputGroup>
                  <Input
                     icon={<User />}
                     placeholder="Nome"
                     type="text"
                     name="firstName"
                     value={nameFields.firstName}
                     onChange={handleNameChange}
                     validationRules={[
                        {
                           validate: (value) => value.length > 3,
                           message: "Nome inválido",
                        },
                     ]}
                     required
                  />
                  <Input
                     icon={<User />}
                     placeholder="Sobrenome"
                     type="text"
                     name="lastName"
                     value={nameFields.lastName}
                     onChange={handleNameChange}
                  />
               </InputGroup>

               {/* Email */}
               <Input
                  icon={<Mail />}
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  validationRules={[
                     {
                        validate: (value) => isEmail(value),
                        message: "Email inválido",
                     },
                  ]}
                  required
               />

               {/* CPF com máscara */}
               <Input
                  icon={<IdCard />}
                  placeholder="CPF"
                  type="text"
                  name="cpf"
                  mask="999.999.999-99"
                  value={formData.cpf}
                  onChange={handleChange}
                  validationRules={[
                     {
                        validate: (value) => isCPF(value),
                        message: "CPF inválido",
                     },
                  ]}
                  required
               />

               {/* Senhas */}
               <InputGroup>
                  <Input
                     icon={<SquareAsterisk />}
                     placeholder="Senha"
                     type="password"
                     name="password"
                     value={formData.password}
                     onChange={handleChange}
                     validationRules={[
                        {
                           validate: (value) => value.length >= 8,
                           message: "A senha deve ter pelo menos 8 caracteres",
                        },
                     ]}
                     required
                  />
                  <Input
                     icon={<SquareAsterisk />}
                     placeholder="Confirmar senha"
                     type="password"
                     name="confirmPassword"
                     value={formData.confirmPassword}
                     onChange={handleChange}
                     validationRules={[
                        {
                           validate: (value) => value === formData.password,
                           message: "As senhas devem ser iguais",
                        },
                     ]}
                     required
                  />
               </InputGroup>

               <Button
                  variant="secondary"
                  className="p-2 hover:bg-accent/80"
                  type="submit"
               >
                  Cadastrar
               </Button>
            </Form>
            <div className="text-center">
               <p className="text-sm">
                  Já possui uma conta?{" "}
                  <span
                     className="text-accent cursor-pointer hover:underline"
                     onClick={() => {
                        onClose();
                        openLoginModal();
                     }}
                  >
                     Entre
                  </span>
               </p>
            </div>
         </div>
      </Modal>
   );
}
