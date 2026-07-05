export function getInitials(first?: string, second?: string) {
  const a = first?.trim()?.[0] || "";
  const b = second?.trim()?.[0] || "";

  if (!a && !b) return "E&K";

  return `${a}${a && b ? "&" : ""}${b}`.toUpperCase();
}
