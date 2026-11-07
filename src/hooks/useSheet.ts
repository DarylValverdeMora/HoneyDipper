import { useCallback, useEffect, useRef } from 'react'
import type { KeyboardEvent, MouseEvent, RefObject } from 'react'
import { useLenisInstance } from '../lib/lenis-context'
import { useKeyboardInset } from './useKeyboardInset'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

type SheetOptions = {
  isOpen: boolean
  onClose: () => void
}

type SheetBindings = {
  dialogRef: RefObject<HTMLDialogElement | null>
  onCancel: (event: { preventDefault: () => void }) => void
  onClick: (event: MouseEvent<HTMLDialogElement>) => void
  onKeyDown: (event: KeyboardEvent<HTMLDialogElement>) => void
}

const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

/** Mantiene el foco dentro de la hoja: de la última opción vuelve a la primera y al revés. */
const trapTabKey = (event: KeyboardEvent<HTMLDialogElement>): void => {
  const focusable = getFocusableElements(event.currentTarget)
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (first === undefined || last === undefined) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
    return
  }
  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

/**
 * Lógica de una hoja modal sobre <dialog>: abre y cierra con el estado, detiene el scroll suave,
 * cierra con Escape o al tocar fuera, atrapa el foco y lo devuelve al botón que la abrió.
 */
export const useSheet = ({ isOpen, onClose }: SheetOptions): SheetBindings => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const lenis = useLenisInstance()
  useKeyboardInset(dialogRef, isOpen)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog === null || !isOpen) return

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const root = document.documentElement
    dialog.showModal()
    lenis?.stop()
    // Con scroll nativo (movimiento reducido) también hay que congelar la página de fondo.
    root.style.overflow = 'hidden'

    return () => {
      dialog.close()
      root.style.overflow = ''
      lenis?.start()
      previouslyFocused?.focus()
    }
  }, [isOpen, lenis])

  const onCancel = useCallback(
    (event: { preventDefault: () => void }) => {
      event.preventDefault()
      onClose()
    },
    [onClose],
  )

  const onClick = useCallback(
    (event: MouseEvent<HTMLDialogElement>) => {
      if (event.target === event.currentTarget) onClose()
    },
    [onClose],
  )

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Tab') trapTabKey(event)
  }, [])

  return { dialogRef, onCancel, onClick, onKeyDown }
}
