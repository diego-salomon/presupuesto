import type { BrandPalette } from '@/config/types'

/** Pushes the brand palette into the CSS custom properties the design system reads. */
export function applyBrandPalette(palette: BrandPalette, root: HTMLElement = document.documentElement): void {
  root.style.setProperty('--primary', palette.primary)
  root.style.setProperty('--primary-foreground', palette.primaryForeground)
  root.style.setProperty('--accent', palette.accent)
  root.style.setProperty('--accent-foreground', palette.accentForeground)
}
