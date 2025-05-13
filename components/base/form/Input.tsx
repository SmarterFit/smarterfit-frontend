"use client";

import { cn, regexFormatter, textToCurrency } from "@/lib/utils";
import React, { useState, useCallback, useEffect } from "react";
import { useFormContext } from "@/components/base/form/Form"; // ajuste o caminho conforme necessário

type ValidationRule = {
   validate: (value: string) => boolean;
   message: string;
};

type InputProps = {
   icon?: React.ReactElement<{ className?: string }>;
   validationRules?: ValidationRule[];
   mask?: string;
   className?: string;
   value: string;
   setValue?: (value: string) => void;
} & React.ComponentProps<"input">;

const baseStyles = "group input";
const iconBaseStyles = "input-icon";
const errorStyles = "input-error ";

export default function Input({
   icon,
   validationRules = [],
   mask,
   className,
   type,
   onChange,
   value,
   setValue,
   ...props
}: InputProps) {
   const { registerValidator, unregisterValidator } = useFormContext();
   const [errors, setErrors] = useState<string[]>([]);

   // Função que valida o campo com base nas regras e atualiza os erros;
   // esta função será registrada no contexto do formulário.
   const validateField = useCallback(() => {
      if (!validationRules || validationRules.length === 0) {
         setErrors([]);
         return true;
      }

      const failedRules = validationRules.filter(
         (rule) => !rule.validate(value)
      );
      setErrors(failedRules.map((rule) => rule.message));
      return failedRules.length === 0;
   }, [validationRules, value]);

   // Registra a função de validação quando o componente monta
   // e a remove quando o componente desmonta.
   useEffect(() => {
      registerValidator(validateField);
      return () => {
         unregisterValidator(validateField);
      };
   }, [registerValidator, unregisterValidator, validateField]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Aplica formatação de máscara, se houver
      let newValue = mask
         ? regexFormatter(mask, e.target.value)
         : e.target.value;

      // Aplica formatação de moeda se o tipo for "currency"
      if (type === "currency") {
         newValue = textToCurrency(newValue);
      }

      // Atualiza o estado no componente pai
      if (setValue) {
         setValue(newValue);
      }

      // Executa a validação com base nas regras definidas
      const failedRules = validationRules.filter(
         (rule) => !rule.validate(newValue)
      );
      setErrors(failedRules.map((rule) => rule.message));

      // Propaga o evento onChange, se houver
      if (onChange) {
         onChange({
            ...e,
            target: { ...e.target, value: newValue },
         } as React.ChangeEvent<HTMLInputElement>);
      }
   };

   /// Adiciona a máscara no valor inicial
   if (mask) {
      const newValue = regexFormatter(mask, value);
      if (setValue) {
         setValue(newValue);
      }
   }

   const classes = cn(
      props.disabled && "disabled",
      baseStyles,
      className,
      errors.length > 0 && "error"
   );

   return (
      <div className="input-parent">
         <label className={classes}>
            {icon &&
               React.cloneElement(icon, {
                  className: cn(iconBaseStyles, icon.props.className),
               })}
            <input
               {...props}
               value={value}
               onChange={handleChange}
               type={type}
            />
         </label>
         {errors.length > 0 && (
            <div className="mt-1 space-y-1 flex flex-col">
               {errors.map((err, idx) => (
                  <span key={idx} className={errorStyles}>
                     {err}
                  </span>
               ))}
            </div>
         )}
      </div>
   );
}
