"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type ValidationRule = {
   validate: (value: string) => boolean;
   message: string;
};

type SelectProps = {
   icon?: React.ReactElement<{ className?: string }>;
   validationRules?: ValidationRule[];
   options: { label: string; value: string }[];
   className?: string;
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
   ...props
}: SelectProps) {
   const [selectedLabel, setSelectedLabel] = useState(
      () => options.find((opt) => opt.value === props.value)?.label || ""
   );
   const [selectedValue, setSelectedValue] = useState(() => props.value || "");
   const [showOptions, setShowOptions] = useState(false);
   const [errors, setErrors] = useState<string[]>([]);
   const ref = useRef<HTMLDivElement>(null);

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

   const handleSelect = (value: string, label: string) => {
      setSelectedValue(value);
      setSelectedLabel(label);
      setShowOptions(false);

      const failedRules = validationRules
         .filter((rule) => !rule.validate(value))
         .map((rule) => rule.message);
      setErrors(failedRules);

      if (onChange) {
         const event = {
            target: {
               name: props.name,
               value: value,
            },
         } as unknown as React.ChangeEvent<HTMLInputElement>;
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
               value={selectedLabel}
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
                     className={cn(optionStyles,opt.value === selectedValue && "selected" )}
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
