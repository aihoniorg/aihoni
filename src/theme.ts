export const ACCENT = '#3B76EF';
export const INK = '#1B1B1F';
export const MUTED = '#8A8A8E';
export const FAINT = '#A8A8AC';
export const LINE = '#EFECEC';
export const LINE2 = '#E6E6E6';
export const BG_SOFT = '#F6F6F6';
export const BG_SOLID = '#FFFFFF';
export const BG = '#FFFFFF';
export const GREEN = '#2E9E6B';

// Pre-computed accent mixes with white
export const ACCENT_SOFT = '#E7EEFD';   // ~12%
export const ACCENT_SOFT2 = '#D4E1FC';  // ~22%
export const ACCENT_SOFT3 = '#ECF2FE';  // ~10%
export const ACCENT_MED = '#C5D6FB';    // ~30%

// Font family names (loaded via expo-font)
export const AH_FONT = 'Poppins_600SemiBold';
export const AH_BRAND_FONT = 'Baloo2_800ExtraBold';

/** Blend a hex color with white at the given fraction (0-1). */
export function mixWithWhite(hex: string, frac: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c: number) => Math.round(c * frac + 255 * (1 - frac));
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}
