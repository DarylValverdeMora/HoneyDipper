import { useCallback } from 'react'
import type { ChangeEvent, FC } from 'react'
import { business } from '../../data/business'
import { useCopyLink } from '../../hooks/useCopyLink'
import type { CopyStatus } from '../../hooks/useCopyLink'
import { useDisclosure } from '../../hooks/useDisclosure'
import { VARIANT_LABELS, VARIANTS } from '../../lib/presentation'
import type { Variant } from '../../lib/presentation'
import { buildShareLink } from '../../lib/whatsapp'
import { Button, ButtonLink } from '../ui/Button'

const COPY_MESSAGES: Record<CopyStatus, string> = {
  listo: '',
  copiado: 'Enlace copiado.',
  error: 'No se pudo copiar. Copia el enlace de la barra de direcciones.',
}

/** En el celular el panel arranca cerrado para no tapar el hero. */
const WIDE_SCREEN_QUERY = '(min-width: 48rem)'

const isVariant = (value: string): value is Variant => {
  return VARIANTS.some((variant) => variant === value)
}

type VariantOptionProps = {
  variant: Variant
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const VariantOption: FC<VariantOptionProps> = ({ variant, checked, onChange }) => {
  return (
    <label className="relative flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-full px-3 text-sm font-medium has-checked:bg-cta has-checked:text-on-cta has-focus-visible:outline-2 has-focus-visible:outline-foreground">
      <input
        type="radio"
        name="variante"
        value={variant}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {VARIANT_LABELS[variant]}
    </label>
  )
}

type PresentPanelProps = {
  variant: Variant
  onSelectVariant: (variant: Variant) => void
}

/**
 * Panel del modo presentación. Solo se monta con ?present=1 (ver App).
 * La variante elegida queda en la URL para mandar cada opción por WhatsApp.
 */
export const PresentPanel: FC<PresentPanelProps> = ({ variant, onSelectVariant }) => {
  const panel = useDisclosure(window.matchMedia(WIDE_SCREEN_QUERY).matches)
  const { status, copy } = useCopyLink()

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (isVariant(event.target.value)) onSelectVariant(event.target.value)
    },
    [onSelectVariant],
  )

  const shareHref = buildShareLink(
    `${business.name}: propuesta ${variant.toUpperCase()} "${VARIANT_LABELS[variant]}" ${window.location.href}`,
  )

  return (
    <aside
      aria-label="Modo presentación"
      data-open={panel.isOpen}
      className="fixed bottom-4 left-4 z-30 rounded-3xl bg-surface p-2 text-foreground shadow-sheet data-[open=true]:w-72 data-[open=true]:p-3 md:bottom-6 md:left-6"
    >
      <div className="flex items-center justify-between gap-2 pl-2">
        <p className="font-display text-xl">
          {panel.isOpen ? 'Modo presentación' : `Variante ${variant.toUpperCase()}`}
        </p>
        <Button intent="discreto" size="sm" onClick={panel.toggle} aria-expanded={panel.isOpen}>
          {panel.isOpen ? 'Ocultar' : 'Mostrar'}
        </Button>
      </div>
      {panel.isOpen && (
        <div className="mt-2 flex flex-col gap-3">
          <fieldset className="flex gap-1 rounded-full bg-surface-soft p-1">
            <legend className="sr-only">Variante de color</legend>
            {VARIANTS.map((option) => {
              return (
                <VariantOption key={option} variant={option} checked={option === variant} onChange={handleChange} />
              )
            })}
          </fieldset>
          <div className="flex gap-2">
            <Button intent="discreto" size="sm" onClick={copy} className="flex-1">
              Copiar enlace
            </Button>
            <ButtonLink href={shareHref} external intent="secundario" size="sm" className="flex-1">
              Mandar por WhatsApp
            </ButtonLink>
          </div>
          <p role="status" className="min-h-5 px-2 text-xs">
            {COPY_MESSAGES[status]}
          </p>
        </div>
      )}
    </aside>
  )
}
