export enum AttendanceStatus {
   PRESENT = "PRESENT",
   ABSENT = "ABSENT",
   LATE = "LATE",
}
export const AttendanceStatusLabels: Record<AttendanceStatus, string> = {
   [AttendanceStatus.PRESENT]: "Presente",
   [AttendanceStatus.ABSENT]: "Ausente",
   [AttendanceStatus.LATE]: "Atrasado",
};
