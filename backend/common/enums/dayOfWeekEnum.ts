export enum DayOfWeek {
   MONDAY = "MONDAY",
   TUESDAY = "TUESDAY",
   WEDNESDAY = "WEDNESDAY",
   THURSDAY = "THURSDAY",
   FRIDAY = "FRIDAY",
   SATURDAY = "SATURDAY",
   SUNDAY = "SUNDAY",
}

export const DayOfWeekLabels: Record<DayOfWeek, string> = {
   [DayOfWeek.MONDAY]: "Segunda-feira",
   [DayOfWeek.TUESDAY]: "Terça-feira",
   [DayOfWeek.WEDNESDAY]: "Quarta-feira",
   [DayOfWeek.THURSDAY]: "Quinta-feira",
   [DayOfWeek.FRIDAY]: "Sexta-feira",
   [DayOfWeek.SATURDAY]: "Sábado",
   [DayOfWeek.SUNDAY]: "Domingo",
};
export const DayOfWeekAbbreviations: Record<DayOfWeek, string> = {
   [DayOfWeek.MONDAY]: "Seg",
   [DayOfWeek.TUESDAY]: "Ter",
   [DayOfWeek.WEDNESDAY]: "Qua",
   [DayOfWeek.THURSDAY]: "Qui",
   [DayOfWeek.FRIDAY]: "Sex",
   [DayOfWeek.SATURDAY]: "Sáb",
   [DayOfWeek.SUNDAY]: "Dom",
};
