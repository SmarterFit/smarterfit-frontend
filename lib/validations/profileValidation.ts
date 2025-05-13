export const isCPF = (value: string): boolean => {
   // Remove caracteres não numéricos
   value = value.replace(/\D/g, "");

   // Verifica se o tamanho é exatamente 11
   if (value.length !== 11) return false;

   // Rejeita CPFs com todos os dígitos iguais
   if (/^(\d)\1{10}$/.test(value)) return false;

   // Validação dos dígitos verificadores
   let sum = 0;
   for (let i = 0; i < 9; i++) {
      sum += parseInt(value.charAt(i)) * (10 - i);
   }

   let remainder = (sum * 10) % 11;
   if (remainder === 10 || remainder === 11) remainder = 0;
   if (remainder !== parseInt(value.charAt(9))) return false;

   sum = 0;
   for (let i = 0; i < 10; i++) {
      sum += parseInt(value.charAt(i)) * (11 - i);
   }

   remainder = (sum * 10) % 11;
   if (remainder === 10 || remainder === 11) remainder = 0;
   if (remainder !== parseInt(value.charAt(10))) return false;

   return true;
};

export const isPhone = (value: string): boolean => {
   const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
   return phoneRegex.test(value);
};