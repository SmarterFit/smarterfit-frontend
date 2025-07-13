export enum SourceType {
   JSON = "JSON",
   XLS = "XLS",
   CSV = "CSV",
}

export const SourceTypeLabels: Record<SourceType, string> = {
   [SourceType.JSON]: "JSON",
   [SourceType.XLS]: "XLS",
   [SourceType.CSV]: "CSV",
};
