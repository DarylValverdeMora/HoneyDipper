import type { FC } from 'react'
import { navLinks, toAnchor } from '../../data/navigation'
import { useMobileNav } from '../../hooks/useMobileNav'
import { FlowButton } from '../flows/FlowButton'
import { MenuIcon } from '../ui/Icons'
import { Sheet } from '../ui/Sheet'
import { Logo } from './Logo'

const MOBILE_NAV_ID = 'menu-movil'

const DesktopNav: FC = () => {
  return (
    <nav aria-label="Principal" className="hidden md:block">
      <ul className="flex items-center gap-1">
        {navLinks.map((link) => {
          return (
            <li key={link.sectionId}>
              <a
                href={toAnchor(link.sectionId)}
                className="inline-flex min-h-11 items-center rounded-full px-4 font-body text-sm font-medium text-on-brand transition-[background-color] duration-150 ease-out hover:bg-on-brand/10"
              >
                {link.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

type MobileNavSheetProps = {
  isOpen: boolean
  onClose: () => void
  navigateTo: ReturnType<typeof useMobileNav>['navigateTo']
}

const MobileNavSheet: FC<MobileNavSheetProps> = ({ isOpen, onClose, navigateTo }) => {
  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Secciones">
      <nav aria-label="Principal (celular)" id={MOBILE_NAV_ID}>
        <ul className="flex flex-col">
          {navLinks.map((link) => {
            return (
              <li key={link.sectionId}>
                <a
                  href={toAnchor(link.sectionId)}
                  onClick={navigateTo(link.sectionId)}
                  className="flex min-h-14 items-center font-display text-2xl text-foreground"
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="mt-8 flex flex-col gap-3">
        <FlowButton flow="reserva" full onBeforeOpen={onClose} />
        <FlowButton flow="pastel" full intent="secundario" onBeforeOpen={onClose} />
      </div>
    </Sheet>
  )
}

/**
 * Header fijo. El logo se ve siempre, en el celular y en escritorio.
 * min-w-0 en los grupos flexibles: nada puede empujar el ancho más allá de la pantalla.
 */
export const Header: FC = () => {
  const { isOpen, open, close, navigateTo } = useMobileNav()

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-header bg-surface-brand shadow-raised">
      <div className="mx-auto flex h-full max-w-6xl min-w-0 items-center justify-between gap-3 px-4 md:gap-4 md:px-6">
        <Logo sizeClassName="h-12 w-16.5 md:h-14 md:w-19" tone="fuerte" />
        <DesktopNav />
        <div className="flex min-w-0 shrink-0 items-center gap-1">
          <FlowButton flow="reserva" size="sm" />
          <button
            type="button"
            onClick={open}
            aria-label="Abrir menú"
            aria-expanded={isOpen}
            aria-controls={MOBILE_NAV_ID}
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-on-brand transition-[scale,background-color] duration-150 ease-out hover:bg-on-brand/10 active:scale-96 md:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </div>
      <MobileNavSheet isOpen={isOpen} onClose={close} navigateTo={navigateTo} />
    </header>
  )
}
