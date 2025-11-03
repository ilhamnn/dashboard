export function getHeatmapColor(change: number): string {
  if (change > 5) return "bg-success/20"
  if (change > 0) return "bg-success/10"
  if (change > -2) return "bg-destructive/10"
  return "bg-destructive/20"
}

export function getTextColor(change: number): string {
  return change >= 0 ? "text-success" : "text-destructive"
}