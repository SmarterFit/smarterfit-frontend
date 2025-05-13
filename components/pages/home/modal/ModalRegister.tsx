"use client";

import { useState } from "react";
import { registerUser } from "@/lib/services/useraccess/userService";
import Button from "@/components/base/buttons/Button";
import Form from "@/components/base/form/Form";
import Input from "@/components/base/form/Input";
import InputGroup from "@/components/base/form/InputGroup";
import Modal from "@/components/base/containers/modal/Modal";
import { IdCard, Mail, SquareAsterisk, User } from "lucide-react";
import { useNotifications } from "@/components/base/notifications/NotificationsContext";
import { ApiRequestError } from "@/lib/exceptions/ApiRequestError";
import {
   isCPF,
   isEmail,
   isName,
   isPassword,
   validateConfirmPassword,
} from "@/lib/validations/userValidations";

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
   // Estado separado para nome e sobrenome, que serão combinados posteriormente.
   const [nameFields, setNameFields] = useState({
      firstName: "",
      lastName: "",
   });
   // Outros dados do formulário.
   const [formData, setFormData] = useState({
      email: "",
      cpf: "",
      password: "",
      confirmPassword: "",
      roles: ["MEMBER"],
   });

   const { addNotification } = useNotifications();

   // Atualiza os campos de nome
   const updateNameField = (field: "firstName" | "lastName", value: string) => {
      setNameFields((prev) => ({ ...prev, [field]: value }));
   };

   // Atualiza os demais campos do formulário
   const updateFormField = (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   const handleRegister = async () => {
      // Combina primeiro e sobrenome em um único nome.
      const fullName =
         `${nameFields.firstName.trim()} ${nameFields.lastName.trim()}`.trim();

      try {
         await registerUser({ ...formData, name: fullName });

         addNotification({
            type: "success",
            title: "Conta criada com sucesso",
            message: "Sua conta foi criada com sucesso.",
         });

         /// Limpa o formulário
         setNameFields({ firstName: "", lastName: "" });
         setFormData({
            email: "",
            cpf: "",
            password: "",
            confirmPassword: "",
            roles: ["MEMBER"],
         });

         onClose();
         openLoginModal();
      } catch (error) {
         if (error instanceof ApiRequestError) {
            if (error.apiError.errors) {
               error.apiError.errors.forEach((err: string) => {
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
                     setValue={(val) => updateNameField("firstName", val)}
                     validationRules={[
                        { validate: isName, message: "Nome inválido" },
                     ]}
                     required
                  />
                  <Input
                     icon={<User />}
                     placeholder="Sobrenome"
                     type="text"
                     name="lastName"
                     value={nameFields.lastName}
                     setValue={(val) => updateNameField("lastName", val)}
                  />
               </InputGroup>

               {/* Email */}
               <Input
                  icon={<Mail />}
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  setValue={(val) => updateFormField("email", val)}
                  validationRules={[
                     { validate: isEmail, message: "Email inválido" },
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
                  setValue={(val) => updateFormField("cpf", val)}
                  validationRules={[
                     { validate: isCPF, message: "CPF inválido" },
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
                     setValue={(val) => updateFormField("password", val)}
                     validationRules={[
                        {
                           validate: isPassword,
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
                     setValue={(val) => updateFormField("confirmPassword", val)}
                     validationRules={[
                        {
                           validate: (value) =>
                              validateConfirmPassword(formData.password, value),
                           message: "As senhas devem ser iguais",
                        },
                     ]}
                     required
                  />
               </InputGroup>

               <Button
                  variant="secondary"
                  className="hover:bg-accent/80"
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
