"use client";

import { useState } from "react";
import { registerUser } from "@/services/userService";
import Button from "@/components/Button";
import Form from "@/components/form/Form";
import Input from "@/components/form/Input";
import Modal from "@/components/modal/Modal";
import { IdCard, Mail, SquareAsterisk, User } from "lucide-react";
import InputGroup from "@/components/form/InputGroup";
import { useNotifications } from "@/components/NotificationsContext";

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
         addNotification({
            type: "error",
            title: "Erro ao registrar",
            message: "Houve um problema ao registrar. Tente novamente.",
         });
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
                  />
                  <Input
                     icon={<SquareAsterisk />}
                     placeholder="Confirmar senha"
                     type="password"
                     name="confirmPassword"
                     value={formData.confirmPassword}
                     onChange={handleChange}
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
