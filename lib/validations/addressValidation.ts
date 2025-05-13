export const isCEP = (value: string): boolean => {
   const cepRegex = /^\d{5}-\d{3}$/;
   return cepRegex.test(value);
};

export const isHouseNumber = (value: string): boolean => {
   return /^[0-9]+[A-Za-z]?$|^S\/N$/i.test(value.trim());
};

export const isCountry = (value: string): boolean => {
   return /^(Brasil|BR)$/i.test(value.trim());
};

const validUFs = [
   "AC",
   "AL",
   "AP",
   "AM",
   "BA",
   "CE",
   "DF",
   "ES",
   "GO",
   "MA",
   "MT",
   "MS",
   "MG",
   "PA",
   "PB",
   "PR",
   "PE",
   "PI",
   "RJ",
   "RN",
   "RS",
   "RO",
   "RR",
   "SC",
   "SP",
   "SE",
   "TO",
];

export const isState = (value: string): boolean => {
   return validUFs.includes(value.toUpperCase());
};
