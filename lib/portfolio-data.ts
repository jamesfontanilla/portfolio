import type { HomeData } from "@/lib/types";
import { fallbackHomeData } from "@/lib/site-data";

/**
 * Local portfolio content.
 *
 * This is intentionally synchronous so the public site has no remote data
 * request in its critical rendering path. A future Supabase-backed admin UI
 * can replace this module without coupling page components to the database.
 */
export const portfolioData: HomeData = fallbackHomeData;

export function getPortfolioData(): HomeData {
  return portfolioData;
}
