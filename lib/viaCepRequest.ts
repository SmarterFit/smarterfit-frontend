import axios from "axios";

interface Address {
   street: string;
   neighborhood: string;
   city: string;
   state: string;
}

export async function getAddressByCep(cep: string): Promise<Address | null> {
   try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const data = response.data;

      if (data.erro) {
         return null;
      }

      return {
         street: data.logradouro,
         neighborhood: data.bairro,
         city: data.localidade,
         state: data.uf,
      };
   } catch (error) {
      return null;
   }
}
