import { useDisclosure } from './useDisclosure'
import type { Disclosure } from './useDisclosure'
import { useElementOnScreen } from './useElementOnScreen'

/** Al ir a otra sección, el borde del inicio puede quedar a la vista unos píxeles; eso no cuenta. */
const HERO_VISIBLE_RATIO = 0.25

type WhatsAppFab = {
  /** Se esconde mientras el inicio está en pantalla, porque ahí ya están los botones principales. */
  isVisible: boolean
  sheet: Disclosure
}

export const useWhatsAppFab = (): WhatsAppFab => {
  const isHeroOnScreen = useElementOnScreen('inicio', HERO_VISIBLE_RATIO)
  const sheet = useDisclosure()
  return { isVisible: !isHeroOnScreen || sheet.isOpen, sheet }
}
