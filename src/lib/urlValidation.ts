export type UrlValidationResult = {
  normalizedUrl: string;
};

const MAX_URL_LENGTH = 2048;

const isLikelyIpv4 = (host: string) => /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host);

const parseIpv4 = (host: string): number[] | null => {
  if (!isLikelyIpv4(host)) return null;
  const parts = host.split('.').map((p) => Number(p));
  if (parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null;
  return parts;
};

const isPrivateIpv4 = (parts: number[]) => {
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
};

const isBlockedHostname = (hostname: string) => {
  const host = hostname.toLowerCase();
  if (host === 'localhost') return true;
  if (host.endsWith('.local')) return true;
  if (host === '0.0.0.0') return true;
  if (host === '::1') return true;
  if (host.startsWith('fe80:')) return true; // link-local
  if (host.startsWith('fc') || host.startsWith('fd')) return true; // unique local
  return false;
};

/**
 * Normaliza y valida una URL introducida por el usuario.
 * - Fuerza esquema (https:// por defecto)
 * - Solo permite http/https
 * - Bloquea localhost / redes privadas evidentes (SSRF básico)
 */
export const normalizeAndValidateUrl = (input: string): UrlValidationResult => {
  const raw = input.trim();
  if (!raw) throw new Error('La URL es obligatoria');
  if (raw.length > MAX_URL_LENGTH) throw new Error('La URL es demasiado larga');

  const withScheme = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;

  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    throw new Error('URL inválida (ej: example.com)');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Solo se permiten URLs http/https');
  }

  if (parsed.username || parsed.password) {
    throw new Error('La URL no puede incluir usuario/contraseña');
  }

  if (isBlockedHostname(parsed.hostname)) {
    throw new Error('URL no permitida');
  }

  const ipv4 = parseIpv4(parsed.hostname);
  if (ipv4 && isPrivateIpv4(ipv4)) {
    throw new Error('URL no permitida');
  }

  return { normalizedUrl: parsed.toString() };
};
