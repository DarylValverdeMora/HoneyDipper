import type { FC } from 'react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { HoneyThreadLayer } from './components/layout/HoneyThreadLayer'
import { WhatsAppFab } from './components/layout/WhatsAppFab'
import { Hero } from './components/sections/Hero/Hero'
import { PreviewSections } from './components/sections/PreviewSections'
import { useLenis } from './hooks/useLenis'
import { useReducedMotion } from './hooks/useReducedMotion'
import { LenisContext } from './lib/lenis-context'

const MAIN_CONTENT_ID = 'contenido'

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

  return (
    <LenisContext value={lenis}>
      <SkipLink />
      <Header />
      <HoneyThreadLayer>
        <main id={MAIN_CONTENT_ID} className="pt-header">
          <Hero />
          <PreviewSections />
        </main>
        <Footer />
      </HoneyThreadLayer>
      <WhatsAppFab />
    </LenisContext>
  )
}
