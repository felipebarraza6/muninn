import raw from "@/data/chile-geo.json";

export type ChileProvince = {
  name: string;
  communes: string[];
};

export type ChileRegion = {
  name: string;
  provinces: ChileProvince[];
};

type RawGeo = {
  regiones: Array<{
    region: string;
    provincias: Array<{ provincia: string; comunas: string[] }>;
  }>;
};

const source = raw as RawGeo;

export const CHILE_REGIONS: ChileRegion[] = source.regiones.map((r) => ({
  name: r.region,
  provinces: r.provincias.map((p) => ({
    name: p.provincia,
    communes: [...p.comunas].sort((a, b) => a.localeCompare(b, "es")),
  })),
}));

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Alias frecuentes → nombre canónico del dataset. */
const REGION_ALIASES: Record<string, string> = {
  arica: "Arica y Parinacota",
  "arica y parinacota": "Arica y Parinacota",
  tarapaca: "Tarapacá",
  antofagasta: "Antofagasta",
  atacama: "Atacama",
  coquimbo: "Coquimbo",
  valparaiso: "Valparaíso",
  v: "Valparaíso",
  rm: "Metropolitana de Santiago",
  metropolitana: "Metropolitana de Santiago",
  "metropolitana de santiago": "Metropolitana de Santiago",
  "region metropolitana": "Metropolitana de Santiago",
  "region metropolitana de santiago": "Metropolitana de Santiago",
  santiago: "Metropolitana de Santiago",
  ohiggins: "Del Libertador Gral. Bernardo O’Higgins",
  "o higgins": "Del Libertador Gral. Bernardo O’Higgins",
  "libertador bernardo ohiggins": "Del Libertador Gral. Bernardo O’Higgins",
  "del libertador gral. bernardo ohiggins": "Del Libertador Gral. Bernardo O’Higgins",
  maule: "Del Maule",
  "del maule": "Del Maule",
  nuble: "Ñuble",
  biobio: "Del Biobío",
  "del biobio": "Del Biobío",
  bio: "Del Biobío",
  araucania: "De la Araucanía",
  "de la araucania": "De la Araucanía",
  "los rios": "De los Ríos",
  "de los rios": "De los Ríos",
  "los lagos": "De los Lagos",
  "de los lagos": "De los Lagos",
  aysen: "Aysén del Gral. Carlos Ibáñez del Campo",
  aisen: "Aysén del Gral. Carlos Ibáñez del Campo",
  "aysen del gral. carlos ibanez del campo": "Aysén del Gral. Carlos Ibáñez del Campo",
  magallanes: "Magallanes y de la Antártica Chilena",
  "magallanes y de la antartica chilena": "Magallanes y de la Antártica Chilena",
};

function findByNormalizedName<T extends { name: string }>(
  items: T[],
  value: string,
): T | undefined {
  const n = normalize(value);
  if (!n) return undefined;
  return items.find((item) => normalize(item.name) === n);
}

export function resolveChileRegion(value: string): ChileRegion | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const direct = findByNormalizedName(CHILE_REGIONS, trimmed);
  if (direct) return direct;
  const aliased = REGION_ALIASES[normalize(trimmed)];
  if (!aliased) return undefined;
  return findByNormalizedName(CHILE_REGIONS, aliased);
}

export function getChileProvinces(regionName: string): ChileProvince[] {
  return resolveChileRegion(regionName)?.provinces ?? [];
}

export function getChileCommunes(regionName: string, provinceName: string): string[] {
  const region = resolveChileRegion(regionName);
  if (!region) return [];
  const province = findByNormalizedName(region.provinces, provinceName);
  return province?.communes ?? [];
}

/** Normaliza valores legacy al nombre del dataset (si se reconoce). */
export function canonicalizeChileGeo(values: {
  region: string;
  province: string;
  commune: string;
}): { region: string; province: string; commune: string } {
  const region = resolveChileRegion(values.region);
  if (!region) {
    return {
      region: values.region,
      province: values.province,
      commune: values.commune,
    };
  }

  const province =
    findByNormalizedName(region.provinces, values.province) ??
    region.provinces.find((p) =>
      p.communes.some((c) => normalize(c) === normalize(values.commune)),
    );

  const commune = province
    ? findByNormalizedName(
        province.communes.map((name) => ({ name })),
        values.commune,
      )?.name
    : undefined;

  return {
    region: region.name,
    province: province?.name ?? values.province,
    commune: commune ?? values.commune,
  };
}
