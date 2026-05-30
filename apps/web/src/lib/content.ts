import { prisma } from "db";
export type { ContentMap } from "./content-helpers";
export { c } from "./content-helpers";

export async function getSiteContent(): Promise<Record<string, string>> {
  try {
    const items = await prisma.siteContent.findMany();
    return Object.fromEntries(items.map((i) => [i.key, i.value]));
  } catch {
    return {};
  }
}
