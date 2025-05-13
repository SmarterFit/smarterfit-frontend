export const isTextField = (value: string): boolean => {
   return /^[A-Za-zÀ-ÿ0-9\s\-']{2,}$/.test(value.trim());
};

export const isPast = (value: string): boolean => {
   if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

   const date = new Date(value);
   if (isNaN(date.getTime())) return false; // Data inválida

   const today = new Date();
   today.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas a data

   return date < today;
};
