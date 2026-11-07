import type { FC } from 'react'
import { business } from '../../data/business'
import { whatsappTemplates } from '../../data/whatsapp'
import { useWhatsAppFab } from '../../hooks/useWhatsAppFab'
import { cn } from '../../lib/cn'
import type { SheetFlow } from '../../lib/whatsapp-flow-context'
import { FlowButton } from '../flows/FlowButton'
import type { ButtonVariants } from '../ui/Button'
import { ChatIcon } from '../ui/Icons'
import { Sheet } from '../ui/Sheet'

const FAB_OPTIONS = [
  { flow: 'reserva', intent: 'principal' },
  { flow: 'pastel', intent: 'secundario' },
  { flow: 'evento', intent: 'discreto' },
] as const satisfies ReadonlyArray<{ flow: SheetFlow; intent: ButtonVariants['intent'] }>

type FabOptionsProps = {
  /** Cierra el selector antes de abrir la hoja elegida. */
  onChoose: () => void
}

/** Cada opción abre su hoja; el foco vuelve al botón flotante al cerrarla. */
const FabOptions: FC<FabOptionsProps> = ({ onChoose }) => {
  return (
    <ul className="flex flex-col gap-5">
      {FAB_OPTIONS.map(({ flow, intent }) => {
        const template = whatsappTemplates[flow]
        const line = business.contact[template.line]
        return (
          <li key={flow} className="flex flex-col gap-1.5">
            <FlowButton flow={flow} full intent={intent} onBeforeOpen={onChoose} />
            <p className="price text-center text-xs text-foreground-accent">
              {line.label}, {line.displayPhone}
            </p>
          </li>
        )
      })}
    </ul>
  )
}

export const WhatsAppFab: FC = () => {
  const { isVisible, sheet } = useWhatsAppFab()

  return (
    <>
      <div
        inert={!isVisible}
        className={cn(
          'fixed right-4 bottom-4 z-30 transition-[opacity,translate] duration-200 ease-out md:right-6 md:bottom-6',
          isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
        )}
      >
        <button
          type="button"
          onClick={sheet.open}
          aria-label="Escríbenos por WhatsApp"
          aria-haspopup="dialog"
          className="inline-flex size-14 items-center justify-center rounded-full bg-cta text-on-cta shadow-raised transition-[scale] duration-150 ease-out active:scale-96"
        >
          <ChatIcon className="size-7" />
        </button>
      </div>
      <Sheet isOpen={sheet.isOpen} onClose={sheet.close} title="Escríbenos por WhatsApp">
        <p className="pb-6 text-sm text-foreground-accent">Elige qué necesitas y te armamos el mensaje.</p>
        <FabOptions onChoose={sheet.close} />
      </Sheet>
    </>
  )
}
