export function buildImageUrl(source: unknown): string {
  if (!source) return "";
  if (typeof source === "string") return source;

  if (typeof source === "object" && source !== null) {
    const url = (source as { url?: unknown }).url;
    if (typeof url === "string") return url;
  }

  return "";
}
