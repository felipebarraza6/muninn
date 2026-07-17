/** Contraseñas al estilo Yggdra (`generate_secure_password`). */

const SPECIAL = "!@#$%&*+-=";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const ALL = LOWER + UPPER + DIGITS + SPECIAL;

function randomInt(max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

function pick(chars: string): string {
  return chars[randomInt(chars.length)];
}

/** 14 chars: mayúsculas, minúsculas, números y símbolo (igual que el backend). */
export function generateSecurePassword(length = 14): string {
  const n = Math.max(8, length);
  const chars = [pick(UPPER), pick(LOWER), pick(DIGITS), pick(SPECIAL)];
  for (let i = chars.length; i < n; i++) chars.push(pick(ALL));
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

/** @deprecated Preferir generateSecurePassword (paridad con generate-password del API). */
export function generateMemorablePassword(_numWords = 3): string {
  return generateSecurePassword(14);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
