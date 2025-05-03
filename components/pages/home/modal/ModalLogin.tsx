import Button from "@/components/Button";
import Form from "@/components/form/Form";
import Input from "@/components/form/Input";
import Modal from "@/components/modal/Modal";
import { Mail, SquareAsterisk } from "lucide-react";

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
   return (
      <Modal isOpen={isOpen} onClose={onClose} title="Login">
         <div className="space-y-6 px-2">
            <Form>
               <Input
                  icon={<Mail />}
                  placeholder="Email"
                  type="email"
                  name="loginEmail"
               />
               <Input
                  icon={<SquareAsterisk />}
                  placeholder="Senha"
                  type="password"
                  name="loginPassword"
               />
               <Button variant="secondary" className="p-2 hover:bg-accent/80">
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
