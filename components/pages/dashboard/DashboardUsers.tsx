"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ CORRETO para App Router
import {
   deleteUserById,
   getAllUsers,
   roleOptions,
   UserResponseDTO,
} from "@/lib/services/useraccess/userService";
import { useNotifications } from "@/components/base/notifications/NotificationsContext";
import Button from "@/components/base/buttons/Button";
import { Plus, Edit, Trash2, RefreshCw } from "lucide-react";
import Badge from "@/components/base/Badge";
import ModalCreateUser from "./modal/ModalUser";
import { getRoleColorMap } from "@/lib/utils";
import Alert from "@/components/base/Alert";
import ModalUser from "./modal/ModalUser";
import {
   getProfileById,
   ProfileResponseDTO,
} from "@/lib/services/useraccess/profileService";

const roleColorMap = getRoleColorMap(roleOptions.map((role) => role.value));

export default function DashboardUsers() {
   const [isMounted, setIsMounted] = useState(false);
   const [loggedUser, setLoggedUser] = useState<UserResponseDTO | null>(null);
   const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
   const [users, setUsers] = useState<UserResponseDTO[]>([]);
   const [createUserModalIsOpen, setCreateUserModalIsOpen] = useState(false);

   const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
   const [deleteUser, setDeleteUser] = useState<boolean>(false);
   const [deleteUserAlertVisible, setDeleteUserAlertVisible] = useState(false);

   const [updatedUser, setUpdatedUser] = useState<UserResponseDTO | null>(null);
   const [updatedProfile, setUpdatedProfile] =
      useState<ProfileResponseDTO | null>(null); // Novo
   const [updateUserModalIsOpen, setUpdatedUserModalIsOpen] = useState(false);

   const router = useRouter();

   const { addNotification } = useNotifications();

   useEffect(() => {
      if (deleteUserId && deleteUser) {
         const handleDelete = async () => {
            try {
               await deleteUserById(deleteUserId);
               setUsers((prev) => prev.filter((u) => u.id !== deleteUserId));
               addNotification({
                  title: "Usuário deletado",
                  message: "O usuário foi removido com sucesso.",
                  type: "success",
               });
            } catch (error) {
               addNotification({
                  title: "Erro ao remover",
                  message: "Não foi possível remover o usuário.",
                  type: "error",
               });
            } finally {
               setDeleteUserId(null);
            }
         };
         handleDelete();
      }
   }, [deleteUser]);

   const handleOpenUpdateUserModal = async (userToUpdate: UserResponseDTO) => {
      setUpdatedUser(userToUpdate);
      try {
         const profile = await getProfileById(userToUpdate.id);
         setUpdatedProfile(profile);
         setUpdatedUserModalIsOpen(true);
      } catch (error) {
         addNotification({
            title: "Erro ao buscar perfil",
            message: String(error),
            type: "error",
         });
      }
   };

   useEffect(() => {
      setIsMounted(true);

      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
         router.push("/dashboard");
         return;
      }

      try {
         const parsedUser: UserResponseDTO = JSON.parse(storedUser);
         setLoggedUser(parsedUser);

         if (parsedUser.roles.includes("ADMIN")) {
            setIsAuthorized(true);
         } else {
            router.push("/dashboard");
         }
      } catch (error) {
         addNotification({
            title: "Erro ao ler user do localStorage",
            message: String(error),
            type: "error",
         });
         router.push("/");
      }
   }, [router]);

   useEffect(() => {
      if (!isAuthorized) return;

      async function fetchUsers() {
         try {
            const data = await getAllUsers();
            setUsers(data);
         } catch (error) {
            addNotification({
               title: "Erro ao buscar usuários",
               message: String(error),
               type: "error",
            });
         }
      }

      fetchUsers();
   }, [isAuthorized]);

   if (!isMounted) return null;

   if (!isAuthorized) return <p>Verificando permissões...</p>;

   return (
      <div className="p-6">
         <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>

            <div className="flex gap-2">
               <Button
                  variant="tertiary"
                  className="p-2"
                  onClick={() => window.location.reload()}
               >
                  <RefreshCw size={16} />
               </Button>
               <Button
                  className="flex items-center gap-2 py-2 bg-green-700 font-bold hover:bg-green-800"
                  onClick={() => setCreateUserModalIsOpen(true)}
               >
                  <Plus size={16} />
                  Criar novo usuário
               </Button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
               <thead>
                  <tr className="bg-foreground/20 text-left">
                     <th className="p-3 border-b">Email</th>
                     <th className="p-3 border-b">Roles</th>
                     <th className="p-3 border-b">Ações</th>
                  </tr>
               </thead>
               <tbody>
                  {users.map((user) => (
                     <tr
                        key={user.id}
                        className="hover:bg-foreground/10 even:bg-accent/5"
                     >
                        <td className="p-3 border-b">{user.email}</td>
                        <td className="p-3 border-b space-x-2">
                           {user.roles.map((role, index) => (
                              <Badge
                                 key={index}
                                 value={role}
                                 color={roleColorMap[role]}
                              />
                           ))}
                        </td>
                        <td className="p-3 border-b space-x-2">
                           <Button
                              className="p-2 bg-blue-700 hover:bg-blue-800"
                              onClick={async () => {
                                 try {
                                    // Chama a função assíncrona e aguarda sua conclusão
                                    await handleOpenUpdateUserModal(user);
                                 } catch (error) {
                                    console.error(
                                       "Erro ao atualizar usuário:",
                                       error
                                    );
                                 }
                              }}
                           >
                              <Edit size={16} />
                           </Button>
                           <Button
                              className="p-2 bg-red-700 hover:bg-red-800"
                              onClick={() => {
                                 setDeleteUserAlertVisible(true);
                                 setDeleteUserId(user.id);
                              }}
                           >
                              <Trash2 size={16} />
                           </Button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <ModalUser
            isOpen={createUserModalIsOpen}
            onClose={() => setCreateUserModalIsOpen(false)}
         />
         <ModalUser
            isOpen={updateUserModalIsOpen}
            onClose={() => {
               setUpdatedUserModalIsOpen(false);
               setUpdatedUser(null);
               setUpdatedProfile(null);
            }}
            user={updatedUser}
            profile={updatedProfile}
         />
         {deleteUserAlertVisible && deleteUserId && (
            <Alert
               title="Deletar Usuário"
               message="Tem certeza que deseja deletar este usuário?"
               type="confirmed"
               setVisible={setDeleteUserAlertVisible}
               setSelected={setDeleteUser}
            />
         )}
      </div>
   );
}
