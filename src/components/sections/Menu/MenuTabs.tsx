import type { FC } from 'react'
import type { MenuGroupId } from '../../../data/menu.types'
import { groupPanelId, groupTabId } from '../../../lib/menu-ids'
import { useRovingTabs } from '../../../hooks/useRovingTabs'
import { cn } from '../../../lib/cn'
import { useMenu } from './menu-context'

/** Pestañas de grupo (Comidas, Brunch, Dulces, Bebidas, Niños). */
export const MenuTabs: FC = () => {
  const { state, actions } = useMenu()
  const ids: readonly MenuGroupId[] = state.groups.map((group) => group.id)
  const { registerTab, onKeyDown } = useRovingTabs({
    ids,
    activeId: state.activeGroup.id,
    onSelect: actions.selectGroup,
  })

  return (
    <div role="tablist" aria-label="Secciones del menú" onKeyDown={onKeyDown} className="scrollbar-none flex h-12 items-end justify-between gap-1 overflow-x-auto sm:justify-start sm:gap-2 lg:h-auto lg:flex-col lg:items-stretch lg:gap-0 lg:overflow-visible">
      {state.groups.map((group) => {
        const isSelected = group.id === state.activeGroup.id
        return (
          <button
            key={group.id}
            ref={registerTab(group.id)}
            id={groupTabId(group.id)}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-controls={groupPanelId(group.id)}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => actions.selectGroup(group.id)}
            className={cn(
              'relative min-h-11 shrink-0 px-1.5 font-display text-lg sm:px-3 sm:text-xl lg:pr-0 lg:pl-4 lg:text-left lg:text-2xl transition-[color] duration-150 ease-out',
              'after:absolute after:inset-x-1.5 after:bottom-1 sm:after:inset-x-3 lg:after:inset-x-auto lg:after:top-1/2 lg:after:left-0 lg:after:h-5 lg:after:w-0.5 lg:after:-translate-y-1/2 after:h-0.5 after:rounded-full after:transition-[opacity,scale] after:duration-200',
              isSelected
                ? 'text-foreground after:scale-x-100 after:bg-foreground after:opacity-100'
                : 'text-foreground-accent after:scale-x-50 after:bg-foreground after:opacity-0 hover:text-foreground',
            )}
          >
            {group.pestana}
          </button>
        )
      })}
    </div>
  )
}
