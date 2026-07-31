export class ControlAccesoRulesService {
  static normalizeCode(value: string): string {
    return value
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toUpperCase();
  }

  static normalizeText(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
  }

  static normalizeNullable(value?: string | null): string | null {
    if (value === undefined || value === null) return null;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }
}
