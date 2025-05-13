"use client";

import Button from "@/components/base/buttons/Button";
import Section from "@/components/base/containers/section/Section";
import ModalLogin from "./modal/ModalLogin";
import { useEffect, useState } from "react";
import ModalRegister from "./modal/ModalRegister";
import { UserResponseDTO } from "@/lib/services/useraccess/userService";
import { useRouter } from "next/navigation";

export default function SectionHero() {
   const [loginIsOpen, setLoginIsOpen] = useState(false);
   const [registerIsOpen, setRegisterIsOpen] = useState(false);
   const [user, setUser] = useState<UserResponseDTO | null>(null);
   const router = useRouter();

   useEffect(() => {
      if (typeof window !== "undefined") {
         setUser(JSON.parse(localStorage.getItem("user") ?? "null"));
      }
   }, []);

   return (
      <Section
         id="section-hero"
         className="relative bg-[url(/imgs/hero.png)] bg-cover bg-center bg-no-repeat"
      >
         {/* Sobreposição escura */}
         <div className="absolute top-0 left-0 w-full h-full bg-dark/80"></div>

         {/* Conteúdo principal */}
         <div className="relative flex flex-col items-center z-10 text-center text-white px-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
               Bem-vindo à SmarterFit
            </h1>
            <p className="text-lg sm:text-xl mb-8">
               Transforme seu corpo e sua vida com os melhores planos de treino.
            </p>
            {user ? (
               <div className="flex justify-center gap-4 w-full md:w-1/3">
                  <Button
                     variant="primary"
                     className="py-2 flex-1 text-lg rounded-full hover:bg-primary/80"
                     onClick={() => {
                        router.push("/dashboard");
                     }}
                  >
                     Acesse o seu Dashboard
                  </Button>
               </div>
            ) : (
               <div className="flex justify-center gap-4 w-full md:w-1/2">
                  <Button
                     variant="primary"
                     className="py-2 flex-1 text-lg rounded-full hover:bg-primary/80"
                     onClick={() => setLoginIsOpen(true)}
                  >
                     Entrar
                  </Button>
                  <Button
                     variant="secondary"
                     className="flex-1 py-2 text-lg rounded-full hover:bg-accent/80"
                     onClick={() => setRegisterIsOpen(true)}
                  >
                     Cadastre-se
                  </Button>
               </div>
            )}
         </div>
         <ModalLogin
            isOpen={loginIsOpen}
            onClose={() => setLoginIsOpen(false)}
            openRegisterModal={() => setRegisterIsOpen(true)}
         />
         <ModalRegister
            isOpen={registerIsOpen}
            onClose={() => setRegisterIsOpen(false)}
            openLoginModal={() => setLoginIsOpen(true)}
         />
      </Section>
   );
}
