import { useCallback } from 'react'
import type { MouseEvent } from 'react'
import type { SectionId } from '../data/navigation'
import { useDisclosure } from './useDisclosure'
import type { Disclosure } from './useDisclosure'
import { useScrollToSection } from './useScrollToSection'

type MobileNav = Disclosure & {
  /** Cierra la hoja y, ya con el scroll liberado, va a la sección. */
  navigateTo: (sectionId: SectionId) => (event: MouseEvent<HTMLAnchorElement>) => void
}

export const useMobileNav = (): MobileNav => {
  const disclosure = useDisclosure()
  const scrollToSection = useScrollToSection()
  const { close } = disclosure

  const navigateTo = useCallback(
    (sectionId: SectionId) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      close()
      requestAnimationFrame(() => scrollToSection(sectionId))
    },
    [close, scrollToSection],
  )

  return { ...disclosure, navigateTo }
}
