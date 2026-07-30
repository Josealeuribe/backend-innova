export class RolRulesService {
  static normalizeName(nombreRol: string): string {
    return nombreRol.trim().replace(/\s+/g, ' ').toUpperCase();
  }

  static normalizeDescription(
    descripcion?: string | null,
  ): string | null {
    if (descripcion === undefined || descripcion === null) {
      return null;
    }

    const normalized = descripcion.trim().replace(/\s+/g, ' ');
    return normalized.length > 0 ? normalized : null;
  }
}
