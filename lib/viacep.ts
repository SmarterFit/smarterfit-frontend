export async function fetchAddressByCep(cep: string): Promise<{
   cep: string;
   logradouro: string;
   complemento: string;
   bairro: string;
   localidade: string;
   uf: string;
   ibge: string;
   gia: string;
   ddd: string;
   siafi: string;
} | null> {
   const sanitized = cep.replace(/\D/g, "");
   const response = await fetch(`https://viacep.com.br/ws/${sanitized}/json/`);

   if (!response.ok) {
      return null;
   }

   const data = await response.json();
   if (data.erro) {
      return null;
   }

   return data;
}
