import type { BrandPalette } from '@/config/types'

/**
 * Pushes the brand color into the CSS custom properties the design system reads.
 * Only the brand hue is set at runtime; everything else (neutrals, status colors)
 * is themed per light/dark in index.css. The brand color is one hue in both modes.
 */
export function applyBrandPalette(palette: BrandPalette, root: HTMLElement = document.documentElement): void {
  root.style.setProperty('--primary', palette.primary)
  root.style.setProperty('--primary-foreground', palette.primaryForeground)
}
