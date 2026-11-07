import { useEffect } from 'react'
import type { RefObject } from 'react'

/** Lo que hay que llevar a la vista cuando el teclado aparece mientras se escribe un texto largo. */
const SEND_LINK_SELECTOR = '[data-send-link]'

const keyboardHeight = (viewport: VisualViewport): number => {
  return Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop))
}

/**
 * En iOS el teclado tapa la página sin achicarla. Mientras la hoja está abierta, se le da un relleno
 * inferior del alto del teclado (--keyboard-inset) para que la hoja quede encima. Si se está
 * escribiendo en un texto largo, se lleva a la vista el botón de enviar y después el campo.
 */
export const useKeyboardInset = (dialogRef: RefObject<HTMLDialogElement | null>, isOpen: boolean): void => {
  useEffect(() => {
    const dialog = dialogRef.current
    const viewport = window.visualViewport
    if (!isOpen || dialog === null || viewport === null) return undefined

    const update = (): void => {
      dialog.style.setProperty('--keyboard-inset', `${keyboardHeight(viewport)}px`)
      const active = document.activeElement
      if (!(active instanceof HTMLTextAreaElement) || !dialog.contains(active)) return
      dialog.querySelector(SEND_LINK_SELECTOR)?.scrollIntoView({ block: 'nearest' })
      active.scrollIntoView({ block: 'nearest' })
    }

    update()
    viewport.addEventListener('resize', update)
    return () => {
      viewport.removeEventListener('resize', update)
      dialog.style.removeProperty('--keyboard-inset')
    }
  }, [dialogRef, isOpen])
}
