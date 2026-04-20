export function normalizeText(value: string): string {
  return value.trim();
}

export function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
