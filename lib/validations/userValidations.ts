export const isEmail = (value: string): boolean => {
   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   return emailRegex.test(value);
};

export const isCPF = (value: string): boolean => {
   // Remove caracteres não numéricos
   value = value.replace(/\D/g, "");

   if (value.length !== 11) return false;

   // Validação de CPF (simples, sem algoritmo complexo)
   let sum = 0;
   let remainder: number;
   for (let i = 1; i <= 9; i++) {
      sum += parseInt(value.charAt(i - 1)) * (11 - i);
   }

   remainder = (sum * 10) % 11;
   if (remainder === 10 || remainder === 11) remainder = 0;
   if (remainder !== parseInt(value.charAt(9))) return false;

   sum = 0;
   for (let i = 1; i <= 10; i++) {
      sum += parseInt(value.charAt(i - 1)) * (12 - i);
   }

   remainder = (sum * 10) % 11;
   if (remainder === 10 || remainder === 11) remainder = 0;
   if (remainder !== parseInt(value.charAt(10))) return false;

   return true;
};

export const isName = (value: string): boolean => value.length >= 3;

export const isPassword = (value: string): boolean => value.length >= 8;

export const isPhone = (value: string): boolean => value.length === 15;

export const isBirthDate = (value: string): boolean => value.length === 10;