export enum ExperienceLevel {
   BEGINNER = "BEGINNER",
   INTERMEDIATE = "INTERMEDIATE",
   ADVANCED = "ADVANCED",
}

export const ExperienceLevelLabels: Record<ExperienceLevel, string> = {
   [ExperienceLevel.BEGINNER]: "Iniciante",
   [ExperienceLevel.INTERMEDIATE]: "Intermediário",
   [ExperienceLevel.ADVANCED]: "Avançado",
};
