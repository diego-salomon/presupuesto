import type { BrandConfig } from './types'

/**
 * WHITE-LABEL FILE 1 of 2 — the client's identity.
 * Change these values (and the palette) to rebrand the whole app. No business
 * name, color or contact detail is hard-coded anywhere else.
 *
 * The demo values below describe a fictional business on the reserved
 * ".example" domain; replace them for a real client.
 */
export const brand: BrandConfig = {
  name: 'Presupuesto Demo',
  tagline: 'Control de gastos y presupuesto mensual para tu negocio',
  logoUrl: undefined,

  palette: {
    primary: '221 83% 53%',
    primaryForeground: '0 0% 100%',
  },

  locale: 'es-MX',
  currency: 'MXN',

  contact: {
    legalName: 'Negocio de ejemplo, S. de R.L.',
    email: 'hola@presupuesto-demo.example',
    phoneDisplay: '+52 55 1234 5678',
    phoneHref: 'tel:+525512345678',
    address: 'Av. de Ejemplo 123, Col. Centro, Ciudad de México',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ciudad%20de%20M%C3%A9xico',
    website: 'https://presupuesto-demo.example',
  },
}
