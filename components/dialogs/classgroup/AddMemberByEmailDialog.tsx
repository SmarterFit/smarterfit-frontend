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
import debounce from "lodash.debounce";

interface UserResponseDTO {
  id: string;
  email: string;
  name?: string;
}

interface AddMemberByEmailDialogProps {
  classGroupId: string;
  onSuccess: () => void;
  triggerComponent: React.ReactNode;
}

export function AddMemberByEmailDialog({ 
  classGroupId, 
  onSuccess, 
  triggerComponent 
}: AddMemberByEmailDialogProps) {
  const [email, setEmail] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("DEFAULT_SUBSCRIPTION");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<UserResponseDTO[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResponseDTO | null>(null);

  // Função debounce para evitar chamadas excessivas
  const debouncedSearch = debounce(async (query: string) => {
    if (query.trim() === "") return setSearchResults([]);
    try {
      const users = await userService.searchUsersByEmail(query);
      setSearchResults(users.slice(0, 5)); // Limita a 5 resultados
    } catch {
      setSearchResults([]);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(email);
    return debouncedSearch.cancel;
  }, [email]);

  const handleAddMember = async () => {
    if (!selectedUser) {
      ErrorToast("Por favor, selecione um usuário da lista");
      return;
    }

    setIsLoading(true);
    try {
      await classGroupUserService.addMemberToClassGroup({
        classGroupId,
        userId: selectedUser.id,
        subscriptionId,
      });

      SuccessToast("Sucesso", "Aluno adicionado com sucesso!");
      setEmail("");
      setSearchResults([]);
      setSelectedUser(null);
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Falha ao adicionar aluno");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Aluno por Email</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Label htmlFor="email" className="block mb-1">Email*</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSelectedUser(null);
              }}
              placeholder="exemplo@email.com"
              autoComplete="off"
            />
            {searchResults.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-48 overflow-y-auto">
                {searchResults.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => {
                      setEmail(user.email);
                      setSelectedUser(user);
                      setSearchResults([]);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subscription" className="text-right">
              Subscription ID
            </Label>
            <Input
              id="subscription"
              value={subscriptionId}
              onChange={(e) => setSubscriptionId(e.target.value)}
              className="col-span-3"
              placeholder="ID da Assinatura"
            />
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
            onClick={handleAddMember}
            disabled={isLoading || !selectedUser}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adicionando...
              </>
            ) : "Adicionar Aluno"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
