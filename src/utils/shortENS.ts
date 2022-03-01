export function shortENS(name: string | null | undefined) {
  return name && name?.substring(0, 7) + "...";
}
