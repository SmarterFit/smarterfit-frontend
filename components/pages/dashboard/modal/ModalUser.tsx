"use client";

import { useEffect, useState } from "react";
import {
   registerUser,
   updateUserById, // Novo método para atualizar o usuário
   roleOptions,
   UserResponseDTO,
} from "@/lib/services/useraccess/userService";
import Modal from "@/components/base/containers/modal/Modal";
import Button from "@/components/base/buttons/Button";
import Input from "@/components/base/form/Input";
import InputGroup from "@/components/base/form/InputGroup";
import Select from "@/components/base/form/Select";
import Form from "@/components/base/form/Form";
import { useNotifications } from "@/components/base/notifications/NotificationsContext";
import { isCPF, isEmail } from "@/lib/validations/userValidations";
import { ApiRequestError } from "@/lib/exceptions/ApiRequestError";
import {
   getProfileById,
   ProfileResponseDTO,
} from "@/lib/services/useraccess/profileService";
import { IdCard, Mail, SquareAsterisk, User, PlusCircle } from "lucide-react";

type ModalUserProps = {
   isOpen: boolean;
   onClose: () => void;
   user?: UserResponseDTO | null;
   profile?: ProfileResponseDTO | null;
};

const nameIsValid = (name: string) => name.length > 3;
const passwordIsValid = (password: string) => password.length >= 8;

export default function ModalUser({
   isOpen,
   onClose,
   user,
   profile,
}: ModalUserProps) {
   const [nameFields, setNameFields] = useState({
      firstName: "",
      lastName: "",
   });

   const [formData, setFormData] = useState({
      email: "",
      cpf: "",
      password: "",
      confirmPassword: "",
   });
   const [selectedRole, setSelectedRole] = useState("");
   const [roles, setRoles] = useState<string[]>([]);
   const [isFormValid, setIsFormValid] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const { addNotification } = useNotifications();

   const fullName = `${nameFields.firstName.trim()} ${nameFields.lastName.trim()}`;

   useEffect(() => {
      if (user && profile) {
         const [firstName, ...rest] = profile.fullName.split(" ");
         const lastName = rest.join(" ");

         setNameFields({
            firstName,
            lastName,
         });

         setFormData({
            email: user.email,
            cpf: profile.cpf,
            password: "",
            confirmPassword: "",
         });

         setRoles(user.roles);
      } else {
         setNameFields({ firstName: "", lastName: "" });
         setFormData({
            email: "",
            cpf: "",
            password: "",
            confirmPassword: "",
         });
         setRoles([]);
      }
      setIsLoading(false);
   }, [isOpen, user, profile]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name === "firstName" || name === "lastName") {
         setNameFields((prev) => ({ ...prev, [name]: value }));
      } else {
         setFormData((prev) => ({ ...prev, [name]: value }));
      }
   };

   const handleAddRole = () => {
      if (selectedRole && !roles.includes(selectedRole)) {
         setRoles([...roles, selectedRole]);
      }
   };

   const handleRemoveRole = (role: string) => {
      setRoles((prev) => prev.filter((r) => r !== role));
   };

   useEffect(() => {
      const valid =
         nameIsValid(nameFields.firstName) &&
         isEmail(formData.email) &&
         isCPF(formData.cpf) &&
         passwordIsValid(formData.password) &&
         formData.password === formData.confirmPassword &&
         roles.length > 0;
      setIsFormValid(valid);
   }, [nameFields, formData, roles]);

   const handleSubmit = async () => {
      try {
         if (user) {
            // Atualiza o usuário
            await updateUserById(user.id, {
               name: fullName,
               email: formData.email,
               cpf: formData.cpf,
               password: formData.password,
               confirmPassword: formData.confirmPassword,
               roles,
            });

            addNotification({
               type: "success",
               title: "Usuário atualizado",
               message: "O usuário foi atualizado com sucesso.",
            });
         } else {
            // Cria um novo usuário
            await registerUser({
               name: fullName,
               email: formData.email,
               cpf: formData.cpf,
               password: formData.password,
               confirmPassword: formData.confirmPassword,
               roles,
            });

            addNotification({
               type: "success",
               title: "Usuário criado",
               message: "O usuário foi cadastrado com sucesso.",
            });
         }

         onClose();
      } catch (error) {
         if (error instanceof ApiRequestError) {
            error.apiError.errors?.forEach((err) =>
               addNotification({
                  type: "error",
                  title: "Erro ao cadastrar",
                  message: err,
               })
            );
         } else {
            addNotification({
               type: "error",
               title: "Erro inesperado",
               message: "Não foi possível cadastrar ou atualizar o usuário.",
            });
         }
      }
   };

   if (isLoading) {
      return <div>Carregando...</div>;
   }

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         title={user ? "Editar Usuário" : "Novo Usuário"}
      >
         <div className="space-y-6 px-2">
            <Form
               method="POST"
               onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
               }}
            >
               <InputGroup>
                  <Input
                     icon={<User />}
                     name="firstName"
                     placeholder="Nome"
                     value={nameFields.firstName}
                     onChange={handleChange}
                     validationRules={[
                        {
                           validate: (value) => nameIsValid(value),
                           message: "O nome deve ter pelo menos 3 caracteres.",
                        },
                     ]}
                     required
                  />
                  <Input
                     icon={<User />}
                     name="lastName"
                     placeholder="Sobrenome"
                     value={nameFields.lastName}
                     onChange={handleChange}
                  />
               </InputGroup>

               <Input
                  icon={<Mail />}
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  validationRules={[
                     {
                        validate: (value) => isEmail(value),
                        message: "Email inválido.",
                     },
                  ]}
                  required
               />

               <Input
                  icon={<IdCard />}
                  name="cpf"
                  placeholder="CPF"
                  type="text"
                  mask="999.999.999-99"
                  value={formData.cpf}
                  onChange={handleChange}
                  validationRules={[
                     {
                        validate: (value) => isCPF(value),
                        message: "CPF inválido.",
                     },
                  ]}
                  required
               />

               <InputGroup>
                  <Input
                     icon={<SquareAsterisk />}
                     name="password"
                     placeholder="Senha"
                     type="password"
                     value={formData.password}
                     onChange={handleChange}
                     validationRules={[
                        {
                           validate: (value) => passwordIsValid(value),
                           message: "A senha deve ter pelo menos 8 caracteres.",
                        },
                     ]}
                     required
                  />
                  <Input
                     icon={<SquareAsterisk />}
                     name="confirmPassword"
                     placeholder="Confirmar senha"
                     type="password"
                     value={formData.confirmPassword}
                     onChange={handleChange}
                     validationRules={[
                        {
                           validate: (value) => value === formData.password,
                           message: "As senhas devem ser iguais.",
                        },
                     ]}
                     required
                  />
               </InputGroup>

               {/* Seletor de roles */}
               <div className="flex items-center gap-2">
                  <Select
                     name="role"
                     options={roleOptions}
                     value={selectedRole}
                     onChange={(e) => setSelectedRole(e.target.value)}
                  />
                  <Button
                     type="button"
                     onClick={handleAddRole}
                     className="py-2 hover:opacity-80 transition"
                     title="Adicionar papel"
                  >
                     <PlusCircle size={24} />
                  </Button>
               </div>

               {/* Lista de roles adicionadas */}
               {roles.length > 0 && (
                  <ul className="flex flex-wrap gap-2 mt-2">
                     {roles.map((role) => (
                        <li
                           key={role}
                           className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-red-300/40"
                           onClick={() => handleRemoveRole(role)}
                           title="Remover papel"
                        >
                           {role}
                        </li>
                     ))}
                  </ul>
               )}

               <Button
                  type="submit"
                  variant="secondary"
                  disabled={!isFormValid}
               >
                  {user ? "Atualizar usuário" : "Criar usuário"}
               </Button>
            </Form>
         </div>
      </Modal>
   );
}
