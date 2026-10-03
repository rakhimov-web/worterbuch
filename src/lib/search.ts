/** Fold case, diacritics (ä→a, ü→u), ß→ss and all Uzbek apostrophe variants so typing is forgiving. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[‘’ʻʼ`´']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchesQuery(fields: string[], query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  return fields.some((f) => normalize(f).includes(q));
}
