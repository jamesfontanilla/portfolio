import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "@/lib/cms";

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function buildImageUrl(source: unknown) {
  if (!source) return "";
  if (typeof source === "string") return source;
  if ("url" in (source as Record<string, unknown>) && typeof (source as { url?: unknown }).url === "string") {
    return (source as { url: string }).url;
  }
  if (!builder) return "";
  return builder.image(source as never).fit("crop").auto("format").url();
}
