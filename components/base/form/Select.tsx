"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useFormContext } from "@/components/base/form/Form"; // ajuste o caminho conforme necessário

type ValidationRule = {
   validate: (value: string) => boolean;
   message: string;
};

type SelectProps = {
   icon?: React.ReactElement<{ className?: string }>;
   validationRules?: ValidationRule[];
   options: { label: string; value: string }[];
   className?: string;
   value: string;
   setValue: (value: string) => void;
} & Omit<React.ComponentProps<"input">, "type">;

const baseStyles = "group input relative cursor-pointer";
const iconBaseStyles = "input-icon";
const errorStyles = "input-error";
const dropdownStyles = "select-dropdown";
const optionStyles = "select-option";

export default function Select({
   icon,
   validationRules = [],
   options,
   className,
   onChange,
   value,
   setValue,
   ...props
}: SelectProps) {
   const { registerValidator, unregisterValidator } = useFormContext();
   const [errors, setErrors] = useState<string[]>([]);
   const [showOptions, setShowOptions] = useState<boolean>(false);
   const ref = useRef<HTMLDivElement>(null);

   // Fecha o dropdown ao clicar fora do componente
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (ref.current && !ref.current.contains(event.target as Node)) {
            setShowOptions(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   // Função de validação registrada no contexto
   const validateField = useCallback(() => {
      const failedRules = validationRules.filter(
         (rule) => !rule.validate(value)
      );
      setErrors(failedRules.map((rule) => rule.message));
      return failedRules.length === 0;
   }, [validationRules, value]);

   // Registra a função de validação quando o componente monta
   useEffect(() => {
      registerValidator(validateField);
      return () => unregisterValidator(validateField);
   }, [registerValidator, unregisterValidator, validateField]);

   const currentValue = value;
   const currentLabel =
      options.find((opt) => opt.value === currentValue)?.label || "";

   const handleSelect = (selectedVal: string, selectedLabel: string) => {
      setShowOptions(false);

      // Executa as validações definidas para o select
      const failedRules = validationRules.filter(
         (rule) => !rule.validate(selectedVal)
      );
      setErrors(failedRules.map((rule) => rule.message));

      // Atualiza o valor via a função setValue fornecida pelo pai
      setValue(selectedVal);

      // Propaga um evento onChange se houver
      if (onChange) {
         const event = {
            target: { name: props.name, value: selectedVal },
         } as React.ChangeEvent<HTMLInputElement>;
         onChange(event);
      }
   };

   const classes = cn(
      props.disabled && "disabled",
      baseStyles,
      className,
      errors.length > 0 && "error"
   );

   return (
      <div ref={ref} className="relative input-parent">
         <label className={classes} onClick={() => setShowOptions((v) => !v)}>
            {icon &&
               React.cloneElement(icon, {
                  className: cn(iconBaseStyles, icon.props.className),
               })}
            <input
               {...props}
               value={currentLabel}
               readOnly
               placeholder={props.placeholder || "Selecione..."}
               className="cursor-pointer"
            />
            <span className="ml-auto">
               {showOptions ? (
                  <ChevronUp className="w-4 h-4 text-foreground/60" />
               ) : (
                  <ChevronDown className="w-4 h-4 text-foreground/60" />
               )}
            </span>
         </label>
         {showOptions && (
            <div className={dropdownStyles}>
               {options.map((opt) => (
                  <div
                     key={opt.value}
                     className={cn(
                        optionStyles,
                        opt.value === currentValue && "selected"
                     )}
                     onClick={() => handleSelect(opt.value, opt.label)}
                  >
                     {opt.label}
                  </div>
               ))}
            </div>
         )}
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
