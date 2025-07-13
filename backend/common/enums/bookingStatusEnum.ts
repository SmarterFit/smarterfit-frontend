export enum BookingStatus {
   CONFIRMED = "CONFIRMED",
   CANCELED = "CANCELED",
}

export const BookingStatusLabels: Record<BookingStatus, string> = {
   [BookingStatus.CONFIRMED]: "Confirmado",
   [BookingStatus.CANCELED]: "Cancelado",
};
