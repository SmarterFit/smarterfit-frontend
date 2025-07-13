export enum ClassKind {
   CLASS_GROUP = "CLASS_GROUP",
   CLASS_EVENT = "CLASS_EVENT",
}

export const ClassKindLabels: Record<ClassKind, string> = {
   [ClassKind.CLASS_GROUP]: "Grupo de Aula",
   [ClassKind.CLASS_EVENT]: "Evento de Aula",
};
