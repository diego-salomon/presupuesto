import { Card } from '@/shared/ui/Card'
import { useContainer } from '@/app/AppContext'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  )
}

export function BusinessInfoPage() {
  const { brand } = useContainer()
  const { contact } = brand

  return (
    <section className="mx-auto flex max-w-xl flex-col gap-5">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">{brand.name}</h2>
        <p className="text-sm text-muted-foreground">{brand.tagline}</p>
      </header>

      <Card className="px-5 py-1">
        <dl>
          {contact.legalName && <Row label="Razón social">{contact.legalName}</Row>}
          {contact.email && (
            <Row label="Correo">
              <a className="text-primary hover:underline" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </Row>
          )}
          {contact.phoneDisplay && (
            <Row label="Teléfono">
              <a className="text-primary hover:underline" href={contact.phoneHref ?? `tel:${contact.phoneDisplay}`}>
                {contact.phoneDisplay}
              </a>
            </Row>
          )}
          {contact.address && (
            <Row label="Dirección">
              {contact.mapsUrl ? (
                <a className="text-primary hover:underline" href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">
                  {contact.address}
                </a>
              ) : (
                contact.address
              )}
            </Row>
          )}
          {contact.website && (
            <Row label="Sitio web">
              <a className="text-primary hover:underline" href={contact.website} target="_blank" rel="noopener noreferrer">
                {contact.website}
              </a>
            </Row>
          )}
        </dl>
      </Card>
    </section>
  )
}
