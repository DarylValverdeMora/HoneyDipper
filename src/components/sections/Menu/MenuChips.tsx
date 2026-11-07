import { useCallback } from 'react'
import type { FC } from 'react'
import type { MenuCategory, MenuCategoryId } from '../../../data/menu.types'
import { categoryAnchorId, categoryTabId } from '../../../hooks/useMenuState'
import { useChipsAutoScroll } from '../../../hooks/useChipsAutoScroll'
import { useRovingTabs } from '../../../hooks/useRovingTabs'
import { cn } from '../../../lib/cn'
import { useMenu } from './menu-context'

/** La categoría con color propio en el menú impreso. Solo su chip usa Rojo terracota. */
const ACCENT_CATEGORY_ID: MenuCategoryId = 'menu-mexicano'

type CategoryChipProps = {
  category: MenuCategory
  isActive: boolean
  registerTab: (id: MenuCategoryId) => (node: HTMLButtonElement | null) => void
  onSelect: (id: MenuCategoryId) => void
}

const CategoryChip: FC<CategoryChipProps> = ({ category, isActive, registerTab, onSelect }) => {
  const isAccent = category.id === ACCENT_CATEGORY_ID
  const handleClick = useCallback(() => onSelect(category.id), [category.id, onSelect])

  return (
    <li role="presentation" className="shrink-0">
      <button
        ref={registerTab(category.id)}
        id={categoryTabId(category.id)}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-controls={categoryAnchorId(category.id)}
        tabIndex={isActive ? 0 : -1}
        data-chip={category.id}
        onClick={handleClick}
        className={cn(
          'inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap',
          'transition-[background-color,color,scale] duration-150 ease-out active:scale-96',
          isActive ? 'bg-cta text-on-cta' : 'bg-surface text-foreground shadow-raised hover:bg-surface-soft',
          isActive && isAccent && 'bg-surface text-foreground ring-2 ring-menu-mexicano ring-inset',
        )}
      >
        {isAccent && <span aria-hidden="true" className="size-2 rounded-full bg-menu-mexicano" />}
        {category.nombre}
      </button>
    </li>
  )
}

/**
 * Categorías del grupo como pestañas: se ve una a la vez. Flechas, Inicio y Fin cambian de categoría.
 * Los grupos de una sola categoría (Dulces, Niños) no muestran esta fila.
 */
export const MenuChips: FC = () => {
  const { state, actions } = useMenu()
  const { activeGroup, activeCategory } = state
  const ids: readonly MenuCategoryId[] = activeGroup.categorias.map((category) => category.id)
  const rowRef = useChipsAutoScroll(activeCategory.id)
  const { registerTab, onKeyDown } = useRovingTabs({ ids, activeId: activeCategory.id, onSelect: actions.selectCategory })

  if (activeGroup.categorias.length < 2) return null

  return (
    <div className="-mx-4 md:-mx-10 lg:mx-0">
      <ul
        ref={rowRef}
        role="tablist"
        aria-label={`Categorías de ${activeGroup.pestana}`}
        onKeyDown={onKeyDown}
        data-lenis-prevent-horizontal
        className="scrollbar-none flex h-14 items-center gap-2 overflow-x-auto px-4 md:px-10 lg:h-auto lg:flex-wrap lg:overflow-visible lg:px-0"
      >
        {activeGroup.categorias.map((category) => {
          return (
            <CategoryChip
              key={category.id}
              category={category}
              isActive={category.id === activeCategory.id}
              registerTab={registerTab}
              onSelect={actions.selectCategory}
            />
          )
        })}
      </ul>
    </div>
  )
}
