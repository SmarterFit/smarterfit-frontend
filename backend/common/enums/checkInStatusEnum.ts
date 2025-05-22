export enum CheckInStatus {
   PRESENT = "PRESENT",
   ABSENT = "ABSENT",
   LATE = "LATE",
}
export const CheckInStatusLabels: Record<CheckInStatus, string> = {
   [CheckInStatus.PRESENT]: "Presente",
   [CheckInStatus.ABSENT]: "Ausente",
   [CheckInStatus.LATE]: "Atrasado",
};
