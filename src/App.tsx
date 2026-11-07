import { lazy, Suspense } from 'react'
import type { FC } from 'react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { HoneyThreadLayer } from './components/layout/HoneyThreadLayer'
import { WhatsAppFab } from './components/layout/WhatsAppFab'
import { Hero } from './components/sections/Hero/Hero'
import { EventosSection } from './components/sections/Eventos/EventosSection'
import { LugarSection } from './components/sections/Lugar/LugarSection'
import { MenuSection } from './components/sections/Menu/MenuSection'
import { PasteleriaSection } from './components/sections/Pasteleria/PasteleriaSection'
import { TodayStrip } from './components/sections/TodayStrip/TodayStrip'
import { VisitaSection } from './components/sections/Visita/VisitaSection'
import { usePresentation } from './hooks/usePresentation'
import { useLenis } from './hooks/useLenis'
import { useReducedMotion } from './hooks/useReducedMotion'
import { LenisContext } from './lib/lenis-context'

const MAIN_CONTENT_ID = 'contenido'

/** El panel solo se descarga en el modo presentación: el dueño nunca lo ve en la página normal. */
const PresentPanel = lazy(async () => {
  const module = await import('./components/presentation/PresentPanel')
  return { default: module.PresentPanel }
})

const SkipLink: FC = () => {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="fixed top-2 left-2 z-50 -translate-y-20 rounded-full bg-cta px-4 py-3 text-sm text-on-cta transition-[translate] duration-150 ease-out focus-visible:translate-y-0"
    >
      Saltar al contenido
    </a>
  )
}

export const App: FC = () => {
  const reducedMotion = useReducedMotion()
  const lenis = useLenis(!reducedMotion)
  const { presentation, selectVariant } = usePresentation()

  return (
    <LenisContext value={lenis}>
      <SkipLink />
      <Header />
      <HoneyThreadLayer>
        <main id={MAIN_CONTENT_ID} className="pt-header">
          <Hero />
          <TodayStrip />
          <MenuSection />
          <PasteleriaSection />
          <EventosSection />
          <LugarSection />
          <VisitaSection />
        </main>
        <Footer />
      </HoneyThreadLayer>
      <WhatsAppFab />
      {presentation.kind === 'activo' && (
        <Suspense fallback={null}>
          <PresentPanel variant={presentation.variant} onSelectVariant={selectVariant} />
        </Suspense>
      )}
    </LenisContext>
  )
}
