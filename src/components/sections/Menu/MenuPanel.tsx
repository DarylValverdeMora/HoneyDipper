import type { FC } from 'react'
import { business } from '../../../data/business'
import { groupPanelId, groupTabId } from '../../../lib/menu-ids'
import { FlowButton } from '../../flows/FlowButton'
import { Button } from '../../ui/Button'
import { useMenu } from './menu-context'
import { MenuCategory } from './MenuCategory'

const NEXT_PREFIX = { categoria: 'Siguiente', grupo: 'Siguiente', inicio: 'Volver al inicio' } as const

/** Final de cada categoría: el paso siguiente y la reserva. El menú nunca termina en un callejón. */
const MenuNext: FC = () => {
  const { state, actions } = useMenu()
  const { next, groups } = state
  const nextGroup = groups.find((group) => group.id === next.selection.groupId)
  const isOtherGroup = next.kind !== 'categoria' && nextGroup !== undefined && nextGroup.pestana !== next.label
  const context = isOtherGroup ? ` (${nextGroup.pestana})` : ''

  return (
    <div className="mt-10 flex flex-col gap-4 border-t border-menu-rule pt-8">
      <p className="text-sm text-foreground">Precios en colones. {business.serviceChargeNote}.</p>
      <div className="flex flex-wrap gap-3">
        <Button intent="discreto" onClick={actions.goToNext} className="ring-1 ring-foreground/25 ring-inset" data-menu-next>
          {NEXT_PREFIX[next.kind]}: {next.label}
          {context}
        </Button>
        <FlowButton flow="reserva" />
      </div>
    </div>
  )
}

/** Panel del grupo activo: solo la categoría elegida y, al final, "Siguiente" y "Reservar mesa". */
export const MenuPanel: FC = () => {
  const { state, meta } = useMenu()
  const { activeGroup, activeCategory, isReviewMode } = state
  const { etiqueta } = activeGroup

  return (
    <div
      ref={meta.panelRef}
      id={groupPanelId(activeGroup.id)}
      role="tabpanel"
      aria-labelledby={groupTabId(activeGroup.id)}
      tabIndex={-1}
      className="scroll-mt-menu-anchor pt-4 pb-16 focus-visible:outline-offset-8 lg:pt-0"
    >
      {etiqueta.texto !== activeGroup.pestana && <p className="text-sm text-foreground">{etiqueta.texto}</p>}
      {isReviewMode && etiqueta.kind === 'pendiente' && (
        <p className="mt-2 rounded-lg bg-surface px-3 py-2 text-xs text-foreground shadow-raised">{etiqueta.placeholder}</p>
      )}
      <MenuCategory
        key={activeCategory.id}
        category={activeCategory}
        isReviewMode={isReviewMode}
        isTabPanel={activeGroup.categorias.length > 1}
      />
      <MenuNext />
    </div>
  )
}
