import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function regexFormatter(mask: string, value: string) {
   const isValidChar = (maskChar: string, inputChar: string) => {
      if (maskChar === "A") return /[A-Za-z]/.test(inputChar);
      if (maskChar === "9") return /\d/.test(inputChar);
      if (maskChar === "*") return /./.test(inputChar);
      return maskChar === inputChar;
   };

   let masked = "";
   let inputIndex = 0;

   for (let i = 0; i < mask.length; i++) {
      const maskChar = mask[i];

      if (inputIndex >= value.length) {
         break;
      } else if (maskChar === "A" || maskChar === "9" || maskChar === "*") {
         while (inputIndex < value.length) {
            const currentChar = value[inputIndex];
            if (isValidChar(maskChar, currentChar)) {
               masked += currentChar;
               inputIndex++;
               break;
            } else {
               inputIndex++; // pula caractere inválido
            }
         }
      } else {
         masked += maskChar;
      }
   }

   return masked;
}

export function textToCurrency(value: string) {
   const onlyNumbers = value.replace(/\D/g, "");
   let money = parseInt(onlyNumbers) / 100;

   if (isNaN(money)) {
      money = 0;
   }

   return money.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const getRoleColorMap = (roleOptions: string[]) => {
   const colorMap: Record<string, number> = {};
   const usedColors = new Set<number>();

   for (const role of roleOptions) {
      let color = Math.floor(Math.random() * 32) + 1;

      // Evita repetir cor se possível
      while (usedColors.has(color) && usedColors.size < 32) {
         color = Math.floor(Math.random() * 32) + 1;
      }

      usedColors.add(color);
      colorMap[role] = color;
   }

   return colorMap;
};
