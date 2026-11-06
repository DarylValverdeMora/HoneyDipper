import type { FC, MouseEvent } from 'react'
import { categoryAnchorId } from '../../../hooks/useMenuState'
import { useChipsAutoScroll } from '../../../hooks/useChipsAutoScroll'
import { cn } from '../../../lib/cn'
import { useMenu } from './menu-context'

/** La categoría con color propio en el menú impreso. Solo su chip usa Rojo terracota. */
const ACCENT_CATEGORY_ID = 'menu-mexicano'

/** Chips de categoría en una fila con scroll horizontal. El activo sigue el scroll de la página. */
export const MenuChips: FC = () => {
  const { state, actions } = useMenu()
  const rowRef = useChipsAutoScroll(state.activeCategoryId)

  return (
    <nav aria-label={`Categorías de ${state.activeGroup.pestana}`} className="-mx-4 md:-mx-6">
      <ul ref={rowRef} data-lenis-prevent-horizontal className="flex h-14 items-center gap-2 scrollbar-none overflow-x-auto px-4 md:px-6">
        {state.activeGroup.categorias.map((category) => {
          const anchorId = categoryAnchorId(category.id)
          const isActive = anchorId === state.activeCategoryId
          const isAccent = category.id === ACCENT_CATEGORY_ID
          const onClick = (event: MouseEvent<HTMLAnchorElement>): void => {
            event.preventDefault()
            actions.selectCategory(category.id)
          }
          return (
            <li key={category.id} className="shrink-0">
              <a
                href={`#${anchorId}`}
                data-chip={anchorId}
                aria-current={isActive ? 'true' : undefined}
                onClick={onClick}
                className={cn(
                  'inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap',
                  'transition-[background-color,color,scale] duration-150 ease-out active:scale-96',
                  isActive ? 'bg-cta text-on-cta' : 'bg-surface text-foreground shadow-raised hover:bg-surface-soft',
                  isActive && isAccent && 'bg-surface text-foreground ring-2 ring-menu-mexicano ring-inset',
                )}
              >
                {isAccent && <span aria-hidden="true" className="size-2 rounded-full bg-menu-mexicano" />}
                {category.nombre}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
