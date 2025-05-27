export enum Goal {
   HYPERTROPHY = "HYPERTROPHY",
   WEIGHT_LOSS = "WEIGHT_LOSS",
}

export const GoalLabels: Record<Goal, string> = {
   [Goal.HYPERTROPHY]: "Hipertrofia",
   [Goal.WEIGHT_LOSS]: "Perda de peso",
};
