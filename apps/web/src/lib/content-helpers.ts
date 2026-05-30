export type ContentMap = Record<string, string>;

export function c(map: ContentMap, key: string, fallback: string): string {
  return map[key] || fallback;
}
