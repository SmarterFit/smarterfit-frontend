import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SuccessToast, ErrorToast } from "@/components/toasts/Toasts";
import { classGroupUserService } from "@/backend/modules/classgroup/service/classGroupUserService";
import { userService } from "@/backend/modules/useraccess/services/userServices";
import { Loader2 } from "lucide-react";
import type { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";

interface AddEmployeeToClassDialogProps {
  classGroupId: string;
  requesterId: string;
  onSuccess: () => void;
  triggerComponent: React.ReactNode;
}

export function AddEmployeeToClassDialog({ 
  classGroupId,
  requesterId,
  onSuccess, 
  triggerComponent 
}: AddEmployeeToClassDialogProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<UserResponseDTO[]>([]);

  // Busca dinâmica por email
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (email.length > 2) {
        try {
          const users = await userService.searchUsersByEmail(email);
          setSearchResults(users.slice(0, 5)); // Limita a 5 resultados
        } catch (error) {
          console.error("Erro ao buscar usuários:", error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    }, 300); // debounce

    return () => clearTimeout(delayDebounceFn);
  }, [email]);

  const handleAddEmployee = async () => {
    if (!email) {
      ErrorToast("Por favor, informe o email do funcionário");
      return;
    }

    setIsLoading(true);

    try {
      const users = await userService.searchUsersByEmail(email);
      const user = users.find((u) => u.email === email);

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      await classGroupUserService.addEmployeeToClassGroup(
        { classGroupId, userId: user.id },
        requesterId
      );

      SuccessToast("Sucesso", "Funcionário adicionado com sucesso!");
      setEmail("");
      setSearchResults([]);
      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      ErrorToast(error?.response?.data?.message || error.message || "Erro ao adicionar funcionário");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerComponent}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Funcionário por Email</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="email" className="text-right mt-2">
              Email*
            </Label>
            <div className="col-span-3 w-full relative">
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
              />
              {searchResults.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-200 rounded shadow-md w-full mt-1 max-h-40 overflow-y-auto">
                  {searchResults.map((user) => (
                    <li
                      key={user.id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={() => {
                        setEmail(user.email);
                        setSearchResults([]);
                      }}
                    >
                      {user.name ? `${user.name} (${user.email})` : user.email}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAddEmployee}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adicionando...
              </>
            ) : "Adicionar Funcionário"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
