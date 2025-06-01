export enum TrainingGroupType {
   PUBLIC = "PUBLIC",
   PRIVATE = "PRIVATE",
   COMPETITIVE = "COMPETITIVE",
}

export const TrainingGroupTypeLabels: Record<TrainingGroupType, string> = {
   [TrainingGroupType.PUBLIC]: "Público",
   [TrainingGroupType.PRIVATE]: "Privado",
   [TrainingGroupType.COMPETITIVE]: "Competitivo",
};
