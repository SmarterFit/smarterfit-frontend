"use client";

import Badge from "@/components/base/Badge";
import Form from "@/components/base/form/Form";
import Input from "@/components/base/form/Input";
import {
   deleteUserById,
   UserResponseDTO,
} from "@/lib/services/useraccess/userService";
import { useEffect, useState } from "react";
import {
   getProfileById,
   updateProfile,
   ProfileResponseDTO,
} from "@/lib/services/useraccess/profileService";
import { Mail, Phone, IdCard, Calendar, Home, User } from "lucide-react"; // Ícones para os campos
import InputGroup from "@/components/base/form/InputGroup";
import Select from "@/components/base/form/Select";
import Button from "@/components/base/buttons/Button";
import { useNotifications } from "@/components/base/notifications/NotificationsContext";
import { ApiRequestError } from "@/lib/exceptions/ApiRequestError";
import Alert from "@/components/base/Alert";
import { useRouter } from "next/navigation";
import { isPast, isTextField } from "@/lib/validations/generalValidation";
import { isCPF, isPhone } from "@/lib/validations/profileValidation";
import {
   isCEP,
   isHouseNumber,
   isState,
} from "@/lib/validations/addressValidation";
import { getAddressByCep } from "@/lib/viaCepRequest";

const isBrowser = typeof window !== "undefined";
const getStoredUser = (): UserResponseDTO | null => {
   if (!isBrowser) return null;

   const stored = localStorage.getItem("user");
   if (!stored) return null;

   try {
      return JSON.parse(stored) as UserResponseDTO;
   } catch (e) {
      console.error("Erro ao parsear o user:", e);
      return null;
   }
};

export default function DashboardProfile() {
   const [user, setUser] = useState<UserResponseDTO | null>(() =>
      getStoredUser()
   );

   const [profile, setProfile] = useState<ProfileResponseDTO | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   const [deleteAccountAlertVisible, setDeleteAccountAlertVisible] =
      useState(false);
   const [deleteAccount, setDeleteAccount] = useState(false);

   const [providedByExternalApi, setProvidedByExternalApi] = useState({
      street: false,
      neighborhood: false,
      city: false,
      state: false,
   });

   const userId = user?.id ?? "";

   const router = useRouter();
   const { addNotification } = useNotifications();

   useEffect(() => {
      if (deleteAccount && userId) {
         const handleDelete = async () => {
            try {
               await deleteUserById(userId);
               localStorage.clear();
               router.push("/");
            } catch (error) {
               addNotification({
                  title: "Erro ao remover",
                  message: "Não foi possível remover o usuário.",
                  type: "error",
               });
            } finally {
               setDeleteAccount(false);
            }
         };

         handleDelete();
      }
   }, [deleteAccount]);

   const handleCepChange = async (cep: string) => {
      if (!isCEP(cep)) {
         console.log("Não é um CEP!");
         setProvidedByExternalApi({
            street: false,
            neighborhood: false,
            city: false,
            state: false,
         });
         return;
      }

      const address = await getAddressByCep(cep);
      if (address && profile) {
         setProfile({
            ...profile,
            address: {
               ...profile?.address,
               cep,
               ...address,
            },
         });

         setProvidedByExternalApi({
            street: address.street !== "",
            neighborhood: address.neighborhood !== "",
            city: address.city !== "",
            state: address.state !== "",
         });
      } else {
         setProvidedByExternalApi({
            street: false,
            neighborhood: false,
            city: false,
            state: false,
         });
      }
   };

   useEffect(() => {
      const fetchProfile = async () => {
         try {
            const profileData = await getProfileById(userId);
            if (!profileData.address) {
               profileData.address = {
                  cep: "",
                  street: "",
                  number: "",
                  neighborhood: "",
                  city: "",
                  state: "",
               };
            }

            setProfile(profileData);
            /// TODO: Bloquear campos cujo CEP dele já retorna
         } catch (error) {
            addNotification({
               title: "Erro ao buscar perfil",
               message: "Não foi possível buscar o perfil.",
               type: "error",
            });
         } finally {
            setIsLoading(false);
         }
      };

      if (userId) fetchProfile();
      
   }, [userId]);

   const updateProfileField = (field: string, value: string) => {
      if (field.startsWith("address.")) {
         const addressField = field.split(".")[1];
         setProfile((prevProfile) => {
            if (!prevProfile) return prevProfile;
            return {
               ...prevProfile,
               address: {
                  ...prevProfile.address,
                  [addressField]: value,
               },
            };
         });
      } else {
         setProfile((prevProfile) =>
            prevProfile ? { ...prevProfile, [field]: value } : prevProfile
         );
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!profile) return;

      try {
         const updatedProfile = await updateProfile(userId, {
            fullName: profile.fullName,
            cpf: profile.cpf,
            phone: profile.phone.replace(/\D/g, ""),
            birthDate: profile.birthDate,
            gender: profile.gender,
            addresses: {
               cep: profile.address?.cep,
               street: profile.address?.street,
               number: profile.address?.number,
               neighborhood: profile.address?.neighborhood,
               city: profile.address?.city,
               state: profile.address?.state,
            },
         });
         setProfile(updatedProfile);

         addNotification({
            type: "success",
            title: "Perfil atualizado com sucesso",
            message: "Seu perfil foi atualizado com sucesso.",
         });
      } catch (error) {
         if (error instanceof ApiRequestError) {
            if (error.apiError.errors) {
               error.apiError.errors.forEach((err) => {
                  addNotification({
                     type: "error",
                     title: "Erro ao atualizar perfil",
                     message: err,
                  });
               });
            }
         } else {
            addNotification({
               type: "error",
               title: "Erro ao atualizar perfil",
               message:
                  "Houve um problema ao atualizar o perfil. Tente novamente.",
            });
         }
      }
   };

   const getImageId = (gender: string) => {
      return gender === "MALE" ? 2 : 1;
   };

   const imageUrl = `https://loremfaces.net/96/id/${getImageId(
      profile?.gender || ""
   )}.jpg`;

   if (isLoading) return <div>Loading...</div>;

   return (
      <div className="w-full flex justify-center">
         <div className="w-1/2 flex flex-col items-center gap-10">
            <div className="w-full">
               <h2 className="text-2xl">Meu usuário:</h2>
               <div className="flex justify-between mt-10">
                  <img
                     src={imageUrl}
                     alt="Foto de perfil"
                     className="rounded-full shadow"
                  />
                  <div className="flex flex-col w-2/3">
                     <div className="input-parent">
                        <label className="group input disabled">
                           <Mail className="input-icon" width={16} />
                           <input value={user?.email || ""} disabled />
                        </label>
                     </div>
                     <div className="mt-4 flex flex-wrap gap-2">
                        {user?.roles?.map((role, index) => (
                           <Badge
                              key={index}
                              value={role.toLowerCase()}
                              color={-1}
                           />
                        ))}
                     </div>
                  </div>
               </div>
            </div>
            <div className="h-[1px] bg-gray-200/20 w-full"></div>
            <div className="w-full">
               <h2 className="text-2xl">Meu perfil:</h2>
               <Form onSubmit={handleSubmit}>
                  <InputGroup>
                     {/* Nome Completo */}
                     <Input
                        icon={<User />}
                        placeholder="Nome Completo"
                        type="text"
                        name="fullName"
                        value={profile?.fullName || ""}
                        setValue={(val) => updateProfileField("fullName", val)}
                        validationRules={[
                           {
                              validate: isTextField,
                              message: "Nome inválido",
                           },
                        ]}
                        required
                     />

                     {/* CPF */}
                     <Input
                        icon={<IdCard />}
                        placeholder="CPF"
                        type="text"
                        name="cpf"
                        value={profile?.cpf || ""}
                        setValue={(val) => updateProfileField("cpf", val)}
                        validationRules={[
                           {
                              validate: isCPF,
                              message: "CPF inválido",
                           },
                        ]}
                        mask="999.999.999-99"
                        required
                     />
                  </InputGroup>
                  <InputGroup>
                     {/* Telefone */}
                     <Input
                        icon={<Phone />}
                        placeholder="Telefone"
                        type="text"
                        name="phone"
                        value={profile?.phone || ""}
                        setValue={(val) => updateProfileField("phone", val)}
                        validationRules={[
                           {
                              validate: isPhone,
                              message: "Telefone inválido",
                           },
                        ]}
                        mask="(99) 99999-9999"
                        required
                     />

                     {/* Data de Nascimento */}
                     <Input
                        icon={<Calendar />}
                        placeholder="Data de Nascimento"
                        type="date"
                        name="birthDate"
                        value={profile?.birthDate || ""}
                        setValue={(val) => updateProfileField("birthDate", val)}
                        validationRules={[
                           {
                              validate: isPast,
                              message: "Data de nascimento inválida",
                           },
                        ]}
                        required
                     />
                     <Select
                        name="gender"
                        placeholder="Sexo..."
                        value={profile?.gender || "OTHER"}
                        setValue={(val) => updateProfileField("gender", val)}
                        options={[
                           { label: "Masculino", value: "MALE" },
                           { label: "Feminino", value: "FEMALE" },
                           { label: "Outro", value: "OTHER" },
                        ]}
                        required
                     />
                  </InputGroup>

                  {/* Endereço */}
                  <div className="text-xl mt-6">Endereço</div>
                  <Input
                     icon={<Home />}
                     placeholder="CEP"
                     type="text"
                     name="address.cep"
                     value={profile?.address?.cep || ""}
                     setValue={(val) => updateProfileField("address.cep", val)}
                     mask="99999-999"
                     validationRules={[
                        {
                           validate: isCEP,
                           message: "CEP inválido",
                        },
                     ]}
                     onChange={(event) => handleCepChange(event.target.value)}
                     required
                  />
                  <InputGroup>
                     <Input
                        icon={<Home />}
                        placeholder="Rua"
                        type="text"
                        name="address.street"
                        value={profile?.address?.street || ""}
                        setValue={(val) =>
                           updateProfileField("address.street", val)
                        }
                        validationRules={[
                           {
                              validate: isTextField,
                              message: "Rua inválida",
                           },
                        ]}
                        required
                        disabled={providedByExternalApi.street}
                     />
                     <Input
                        icon={<Home />}
                        placeholder="Número"
                        type="text"
                        name="address.number"
                        value={profile?.address?.number || ""}
                        setValue={(val) =>
                           updateProfileField("address.number", val)
                        }
                        validationRules={[
                           {
                              validate: isHouseNumber,
                              message: "Número inválido",
                           },
                        ]}
                        required
                     />
                  </InputGroup>
                  <InputGroup>
                     <Input
                        icon={<Home />}
                        placeholder="Bairro"
                        type="text"
                        name="address.neighborhood"
                        value={profile?.address?.neighborhood || ""}
                        setValue={(val) =>
                           updateProfileField("address.neighborhood", val)
                        }
                        validationRules={[
                           {
                              validate: isTextField,
                              message: "Bairro inválido",
                           },
                        ]}
                        disabled={providedByExternalApi.neighborhood}
                        required
                     />
                     <Input
                        icon={<Home />}
                        placeholder="Cidade"
                        type="text"
                        name="address.city"
                        value={profile?.address?.city || ""}
                        setValue={(val) =>
                           updateProfileField("address.city", val)
                        }
                        validationRules={[
                           {
                              validate: isTextField,
                              message: "Cidade inválida",
                           },
                        ]}
                        disabled={providedByExternalApi.city}
                        required
                     />
                     <Input
                        icon={<Home />}
                        placeholder="Estado"
                        type="text"
                        name="address.state"
                        value={profile?.address?.state || ""}
                        setValue={(val) =>
                           updateProfileField("address.state", val)
                        }
                        validationRules={[
                           {
                              validate: isState,
                              message: "Estado inválido",
                           },
                        ]}
                        disabled={providedByExternalApi.state}
                        required
                     />
                  </InputGroup>

                  {/* Botão de Salvar */}
                  <div className="flex gap-2">
                     <Button
                        type="submit"
                        className="py-2 flex-1 bg-green-700 hover:bg-green-800"
                     >
                        Salvar alterações
                     </Button>
                     <Button
                        type="button"
                        className="py-2 flex-1 bg-red-700 hover:bg-red-800"
                        onClick={() => setDeleteAccountAlertVisible(true)}
                     >
                        Deletar conta
                     </Button>
                  </div>
               </Form>
            </div>
         </div>
         {deleteAccountAlertVisible && (
            <Alert
               title="Deletar Conta"
               message="Tem certeza que deseja deletar a sua conta?"
               type="confirmed"
               setVisible={setDeleteAccountAlertVisible}
               setSelected={setDeleteAccount}
            />
         )}
      </div>
   );
}
