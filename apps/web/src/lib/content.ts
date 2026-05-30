import { unstable_cache } from "next/cache";
import { prisma } from "db";
export type { ContentMap } from "./content-helpers";
export { c } from "./content-helpers";

export const getSiteContent = unstable_cache(
  async (): Promise<Record<string, string>> => {
    try {
      const items = await prisma.siteContent.findMany();
      return Object.fromEntries(items.map((i) => [i.key, i.value]));
    } catch {
      return {};
    }
  },
  ["site-content"],
  { revalidate: 3600, tags: ["content"] }
);
