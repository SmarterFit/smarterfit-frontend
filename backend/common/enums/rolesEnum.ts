export enum RoleType {
   MEMBER = "MEMBER",
   TRAINER = "TRAINER",
   PERSONAL_TRAINER = "PERSONAL_TRAINER",
   RECEPTIONIST = "RECEPTIONIST",
   EMPLOYEE = "EMPLOYEE",
   ADMIN = "ADMIN",
}

export const RoleLabels: Record<RoleType, string> = {
   [RoleType.MEMBER]: "Membro",
   [RoleType.TRAINER]: "Treinador",
   [RoleType.PERSONAL_TRAINER]: "Personal Trainer",
   [RoleType.RECEPTIONIST]: "Recepcionista",
   [RoleType.EMPLOYEE]: "Funcionário",
   [RoleType.ADMIN]: "Administrador",
};
