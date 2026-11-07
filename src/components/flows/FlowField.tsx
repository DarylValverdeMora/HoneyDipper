import { useCallback } from 'react'
import type { ChangeEvent, FC, FormEvent, ReactNode } from 'react'

/** 16 px o más en los campos: así iOS no hace zoom al tocarlos. 48 px de alto para tocar cómodo. */
export const CONTROL_STYLES =
  'min-h-12 w-full rounded-2xl border border-foreground/25 bg-surface px-4 text-base text-foreground transition-[border-color] duration-150 ease-out hover:border-foreground/50 aria-invalid:border-foreground'

/** Para textarea: mismo borde y letra, con relleno vertical. */
export const TEXTAREA_STYLES = `${CONTROL_STYLES} resize-none py-3 leading-snug`

type FlowFieldProps = {
  label: string
  htmlFor: string
  messageId: string
  message: string
  children: ReactNode
  /** Algo que va a la derecha de la etiqueta, como el contador de caracteres. */
  aside?: ReactNode
}

/** Etiqueta real, el campo y un aviso que se anuncia al cambiar (aria-live). */
export const FlowField: FC<FlowFieldProps> = ({ label, htmlFor, messageId, message, children, aside }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </label>
        {aside}
      </div>
      {children}
      <p id={messageId} aria-live="polite" className="text-sm text-pretty text-foreground">
        {message}
      </p>
    </div>
  )
}

type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

/** Convierte un setter de texto en un onChange estable. */
export const useFieldHandler = (setter: (value: string) => void) => {
  return useCallback((event: ChangeEvent<FieldElement>) => setter(event.target.value), [setter])
}

/** Primera línea de cada hoja. */
export const FlowIntro: FC = () => {
  return <p className="pb-6 text-sm text-pretty">Llena lo que sepas. Lo que falte lo completas en el chat de WhatsApp.</p>
}

const preventSubmit = (event: FormEvent<HTMLFormElement>): void => {
  event.preventDefault()
}

/** Formulario de una hoja. No se envía: el envío es el enlace de WhatsApp. */
export const FlowForm: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <form noValidate onSubmit={preventSubmit} className="flex flex-col gap-5">
      {children}
    </form>
  )
}
