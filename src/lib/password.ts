/** Contraseñas memorables para create local (antes de existir user id). */

const WORDS = [
  "Sol",
  "Luna",
  "Mar",
  "Rio",
  "Cielo",
  "Nube",
  "Viento",
  "Fuego",
  "Tierra",
  "Bosque",
  "Montaña",
  "Valle",
  "Estrella",
  "Norte",
  "Sur",
  "Aurora",
  "Niebla",
  "Cascada",
  "Arena",
  "Roca",
  "Trigo",
  "Olivo",
  "Cobre",
  "Plata",
];

function randomInt(max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

/** Formato: Palabra1Palabra2Palabra3### (igual espíritu que Yggdra). */
export function generateMemorablePassword(numWords = 3): string {
  const picked: string[] = [];
  for (let i = 0; i < numWords; i++) {
    picked.push(WORDS[randomInt(WORDS.length)]);
  }
  const digits = String(100 + randomInt(900));
  return `${picked.join("")}${digits}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
