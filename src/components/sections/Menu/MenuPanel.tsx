import type { FC } from 'react'
import { business } from '../../../data/business'
import { groupPanelId, groupTabId } from '../../../hooks/useMenuState'
import { ReserveButton } from '../../flows/ReserveButton'
import { useMenu } from './menu-context'
import { MenuCategory } from './MenuCategory'

/** Panel del grupo activo. Solo se renderiza ese grupo. */
export const MenuPanel: FC = () => {
  const { state, meta } = useMenu()
  const { activeGroup, isReviewMode } = state
  const { etiqueta } = activeGroup

  return (
    <div
      ref={meta.panelRef}
      id={groupPanelId(activeGroup.id)}
      role="tabpanel"
      aria-labelledby={groupTabId(activeGroup.id)}
      tabIndex={0}
      className="scroll-mt-menu-anchor pt-4 pb-16 focus-visible:outline-offset-8 lg:pt-0"
    >
      {etiqueta.texto !== activeGroup.pestana && <p className="text-sm text-foreground">{etiqueta.texto}</p>}
      {isReviewMode && etiqueta.kind === 'pendiente' && (
        <p className="mt-2 rounded-lg bg-surface px-3 py-2 text-xs text-foreground shadow-raised">{etiqueta.placeholder}</p>
      )}
      {activeGroup.categorias.map((category) => {
        return <MenuCategory key={category.id} category={category} isReviewMode={isReviewMode} />
      })}
      <div className="mt-8 flex flex-col items-start gap-4">
        <p className="text-sm text-foreground">Precios en colones. {business.serviceChargeNote}.</p>
        <ReserveButton />
      </div>
    </div>
  )
}
