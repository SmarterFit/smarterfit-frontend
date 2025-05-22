export enum ProfileMetricType {
   HEIGHT = "HEIGHT",
   WEIGHT = "WEIGHT",
   BODY_FAT = "BODY_FAT",
   MUSCLE_MASS = "MUSCLE_MASS",
   WAIST = "WAIST",
   HIP = "HIP",
   ARM = "ARM",
   THIGH = "THIGH",
   BLOOD_PRESSURE = "BLOOD_PRESSURE",
   HEART_RATE = "HEART_RATE",
}

export const ProfileMetricLabels: Record<ProfileMetricType, string> = {
   [ProfileMetricType.HEIGHT]: "Altura",
   [ProfileMetricType.WEIGHT]: "Peso",
   [ProfileMetricType.BODY_FAT]: "Gordura Corporal",
   [ProfileMetricType.MUSCLE_MASS]: "Massa Músculo",
   [ProfileMetricType.WAIST]: "Cintura",
   [ProfileMetricType.HIP]: "Quadril",
   [ProfileMetricType.ARM]: "Braço",
   [ProfileMetricType.THIGH]: "Perna",
   [ProfileMetricType.BLOOD_PRESSURE]: "Pressão Arterial",
   [ProfileMetricType.HEART_RATE]: "Pulsação",
};
