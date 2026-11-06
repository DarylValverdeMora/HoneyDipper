import { useId } from 'react'
import type { FC, ReactNode } from 'react'
import { useSheet } from '../../hooks/useSheet'
import { CloseIcon } from './Icons'

type SheetProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/**
 * Hoja modal accesible sobre <dialog>: sube desde abajo en móvil y entra por la derecha
 * desde md. Escape y tocar fuera la cierran; el foco queda atrapado adentro.
 */
export const Sheet: FC<SheetProps> = ({ isOpen, onClose, title, children }) => {
  const titleId = useId()
  const { dialogRef, onCancel, onClick, onKeyDown } = useSheet({ isOpen, onClose })

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={onCancel}
      onClick={onClick}
      onKeyDown={onKeyDown}
      data-lenis-prevent
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none items-end bg-backdrop p-0 text-foreground backdrop:bg-transparent open:flex motion-safe:open:animate-backdrop-in md:items-stretch md:justify-end"
    >
      <div className="flex max-h-11/12 w-full flex-col overflow-y-auto overscroll-contain rounded-t-3xl bg-surface px-6 pt-4 pb-8 shadow-sheet motion-safe:animate-sheet-in-bottom md:h-full md:max-h-none md:w-96 md:rounded-t-none md:rounded-l-3xl md:pt-6 md:motion-safe:animate-sheet-in-right">
        <div className="flex items-center justify-between gap-4 pb-4">
          <h2 id={titleId} className="text-3xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mr-2.5 inline-flex size-11 items-center justify-center rounded-full transition-[scale,background-color] duration-150 ease-out hover:bg-foreground/5 active:scale-96"
          >
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
