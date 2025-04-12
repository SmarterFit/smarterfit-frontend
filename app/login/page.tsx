"use client";

import Button from "@/components/Button";
import Form from "@/components/form/Form";
import Input from "@/components/form/Input";
import InputGroup from "@/components/form/InputGroup";
import FlipContainer from "@/components/panel/FlipContainer";
import Panel from "@/components/panel/Panel";
import { IdCard, Mail, SquareAsterisk } from "lucide-react";
import { useState } from "react";

export default function Login() {
   const [isFlipped, setIsFlipped] = useState(false);

   return (
      <main className="flex-1 p-8 relative">
         <div className="panel-size absolute left-1/2 -translate-x-1/2 sm:top-1/4">
            <FlipContainer isFlipped={isFlipped}>
               <Panel flip={true}>
                  <h2 className="text-3xl font-bold">Login</h2>
                  <p className="text-xl">Lorem ipsum dolor sit amet</p>
                  <Form>
                     <Input icon={<Mail />} placeholder="Email" type="email" />
                     <Input
                        icon={<SquareAsterisk />}
                        placeholder="Senha"
                        type="password"
                     />
                     <Button
                        variant="secondary"
                        className="p-2 hover:bg-accent/80"
                     >
                        Entrar
                     </Button>
                  </Form>
                  <p className="text-sm text-foreground/40 text-center">
                     Não possui uma conta?{" "}
                     <a
                        className="underline font-bold"
                        onClick={() => setIsFlipped(true)}
                     >
                        Cadastre-se
                     </a>
                  </p>
               </Panel>
               <Panel flip={true} flipClassName="rotate-y-180">
                  <h2 className="text-3xl font-bold">Cadastre-se</h2>
                  <p className="text-xl">Lorem ipsum dolor sit amet</p>
                  <Form>
                     <InputGroup>
                        <Input type="text" placeholder="Nome" />
                        <Input type="text" placeholder="Sobrenome" />
                     </InputGroup>
                     <Input icon={<Mail />} placeholder="Email" type="email" />
                     <Input
                        icon={<IdCard />}
                        placeholder="CPF"
                        type="text"
                        mask="999.999.999-99"
                     />
                     <InputGroup>
                        <Input
                           icon={<SquareAsterisk />}
                           placeholder="Senha"
                           type="password"
                        />
                        <Input
                           icon={<SquareAsterisk />}
                           placeholder="Confirmar senha"
                           type="password"
                        />
                     </InputGroup>
                     <Button
                        variant="secondary"
                        className="p-2 hover:bg-accent/80"
                     >
                        Entrar
                     </Button>
                  </Form>
                  <p className="text-sm text-foreground/40 text-center">
                     Já possui uma conta?{" "}
                     <a
                        className="underline font-bold"
                        onClick={() => setIsFlipped(false)}
                     >
                        Log In
                     </a>
                  </p>
               </Panel>
            </FlipContainer>
         </div>
      </main>
   );
}
