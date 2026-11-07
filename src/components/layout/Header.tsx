import type { FC } from 'react'
import { navLinks, toAnchor } from '../../data/navigation'
import { whatsappTemplates } from '../../data/whatsapp'
import { useMobileNav } from '../../hooks/useMobileNav'
import { buildWhatsAppLink } from '../../lib/whatsapp'
import { ReserveButton } from '../flows/ReserveButton'
import { ButtonLink } from '../ui/Button'
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
      <nav aria-label="Principal" id={MOBILE_NAV_ID}>
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
        <ReserveButton full onBeforeOpen={onClose} />
        <ButtonLink href={buildWhatsAppLink({ flow: 'pastel' })} external full intent="secundario">
          {whatsappTemplates.pastel.ctaLabel}
        </ButtonLink>
      </div>
    </Sheet>
  )
}

export const Header: FC = () => {
  const { isOpen, open, close, navigateTo } = useMobileNav()

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-header bg-surface-brand shadow-raised">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Logo className="h-14" />
        <DesktopNav />
        <div className="flex items-center gap-1">
          <ReserveButton size="sm" />
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
