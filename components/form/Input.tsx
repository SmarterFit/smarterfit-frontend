"use client";

import { cn, regexFormatter, textToCurrency } from "@/lib/utils";
import React, { useState } from "react";

type ValidationRule = {
   validate: (value: string) => boolean;
   message: string;
};

type InputProps = {
   icon?: React.ReactElement<{ className?: string }>;
   validationRules?: ValidationRule[];
   mask?: string;
   className?: string;
} & React.ComponentProps<"input">;

const baseStyles = "group input";
const iconBaseStyles = "input-icon";
const errorStyles = "input-error ";

/// TODO: ADD Currency Type

export default function Input({
   icon,
   validationRules = [],
   mask,
   className,
   type,
   onChange,
   ...props
}: InputProps) {
   const [inputValue, setInputValue] = useState("");
   const [errors, setErrors] = useState<string[]>([]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value =
         (mask && regexFormatter(mask, e.target.value)) || e.target.value;

      if (type === "currency") {
         value = textToCurrency(value);
      }

      setInputValue(value);

      const failedRules = validationRules
         .filter((rule) => !rule.validate(value))
         .map((rule) => rule.message);

      setErrors(failedRules);

      if (onChange) onChange(e);
   };

   const classes = cn(baseStyles, className);

   return (
      <div>
         <label className={classes}>
            {icon &&
               React.cloneElement(icon, {
                  className: cn(iconBaseStyles, icon.props.className),
               })}
            <input
               {...props}
               value={inputValue}
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
