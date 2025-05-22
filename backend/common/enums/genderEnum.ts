export enum Gender {
   MALE = "MALE",
   FEMALE = "FEMALE",
   OTHER = "OTHER",
}

export const GenderLabels: Record<Gender, string> = {
   [Gender.MALE]: "Masculino",
   [Gender.FEMALE]: "Feminino",
   [Gender.OTHER]: "Outro",
};
