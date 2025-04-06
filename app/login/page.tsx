import Button from "@/components/Button";
import Form from "@/components/form/Form";
import Input from "@/components/form/Input";
import InputIcon from "@/components/form/InputIcon";
import { Mail, SquareAsterisk } from "lucide-react";

export default function Login() {
   return (
      <main className="flex items-center justify-center flex-1 px-8">
         <div className="flex flex-col gap-4 p-8 rounded-xl bg-black/10 dark:bg-white/10 shadow-lg w-full sm:w-2/3 lg:w-1/3 xl:w-1/4">
            <h2 className="text-3xl font-bold">Login</h2>
            <p className="text-xl">Lorem ipsum dolor sit amet</p>
            <Form>
               <InputIcon icon={<Mail />} placeholder="Email" />
               <InputIcon icon={<SquareAsterisk />} placeholder="Password" />
               <Button variant="secondary" className="p-2 hover:bg-accent/80">
                  Entrar
               </Button>
            </Form>
            <p className="text-sm text-foreground/40 text-center">
               Não possui uma conta?{" "}
               <a href="/cadastro" className="underline font-bold">
                  Cadastre-se
               </a>
            </p>
         </div>
      </main>
   );
}
