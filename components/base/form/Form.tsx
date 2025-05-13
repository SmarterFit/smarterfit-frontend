"use client";

import React, { createContext, useContext, useRef } from "react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/components/base/notifications/NotificationsContext";

// Define o tipo da função de validação. Deve retornar true se o campo estiver válido.
type FieldValidator = () => boolean;

type FormContextType = {
   registerValidator: (validator: FieldValidator) => void;
   unregisterValidator: (validator: FieldValidator) => void;
};

// Cria o contexto para os campos se registrarem
const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = (): FormContextType => {
   const context = useContext(FormContext);
   if (!context) {
      throw new Error(
         "useFormContext deve ser usado dentro de um provedor Form"
      );
   }
   return context;
};

type FormProps = {
   className?: string;
} & React.ComponentProps<"form">;

const baseStyles = "form";

export default function Form({ className, onSubmit, ...props }: FormProps) {
   const classes = cn(baseStyles, className);
   const { addNotification } = useNotifications();

   // Usamos um ref para armazenar os validadores registrados pelos campos
   const validatorsRef = useRef<Set<FieldValidator>>(new Set());

   const registerValidator = (validator: FieldValidator) => {
      validatorsRef.current.add(validator);
   };

   const unregisterValidator = (validator: FieldValidator) => {
      validatorsRef.current.delete(validator);
   };

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Executa todas as funções de validação registradas
      const allValid = Array.from(validatorsRef.current).every((validate) =>
         validate()
      );

      if (!allValid) {
         addNotification({
            type: "error",
            title: "Erro no formulário",
            message:
               "Alguns campos não estão válidos. Verifique os dados e tente novamente.",
         });
         return;
      }

      if (onSubmit) {
         onSubmit(e);
      }
   };

   const contextValue: FormContextType = {
      registerValidator,
      unregisterValidator,
   };

   return (
      <FormContext.Provider value={contextValue}>
         <form className={classes} onSubmit={handleSubmit} {...props} />
      </FormContext.Provider>
   );
}
