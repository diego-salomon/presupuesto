import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { brand } from '@/config/brand.config'
import { presupuesto } from '@/config/presupuesto.config'
import { applyBrandPalette } from '@/shared/ui/theme'
import { createContainer } from '@/app/container'
import { ContainerProvider } from '@/app/AppContext'
import { App } from '@/app/App'
import '@/index.css'

applyBrandPalette(brand.palette)
document.title = brand.name

const container = createContainer({ brand, config: presupuesto })
const root = createRoot(document.getElementById('root') as HTMLElement)

container
  .boot()
  .then(() => {
    root.render(
      <StrictMode>
        <ContainerProvider container={container}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ContainerProvider>
      </StrictMode>,
    )
  })
  .catch((err: unknown) => {
    root.render(
      <div role="alert" style={{ padding: 24, fontFamily: 'system-ui', maxWidth: 560, margin: '48px auto' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>No se pudo iniciar la aplicación</h1>
        <p style={{ marginTop: 8 }}>{err instanceof Error ? err.message : String(err)}</p>
      </div>,
    )
  })
