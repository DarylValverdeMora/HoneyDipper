import type { FC } from 'react'
import type { MenuCategory as MenuCategoryData } from '../../../data/menu.types'
import { categoryAnchorId } from '../../../hooks/useMenuState'
import { honeyDrop } from '../../../lib/honey-drop'
import { toDisplayText } from '../../../lib/menu'
import { cn } from '../../../lib/cn'
import { MenuItem } from './MenuItem'

/** Categorías con fondo propio en el menú impreso. */
const SURFACE_BY_CATEGORY: Partial<Record<MenuCategoryData['id'], 'hamburguesas'>> = {
  hamburguesas: 'hamburguesas',
}

type MenuCategoryProps = {
  category: MenuCategoryData
}

export const MenuCategory: FC<MenuCategoryProps> = ({ category }) => {
  const surface = SURFACE_BY_CATEGORY[category.id]
  const titleId = `${categoryAnchorId(category.id)}-titulo`

  return (
    <section
      id={categoryAnchorId(category.id)}
      aria-labelledby={titleId}
      data-menu-surface={surface}
      className={cn(
        'scroll-mt-menu-anchor py-8',
        surface !== undefined && 'my-4 rounded-3xl bg-menu-surface px-4 md:px-6',
      )}
    >
      <h3 id={titleId} {...honeyDrop} className="text-4xl italic">
        {category.nombre}
      </h3>
      {category.nota !== undefined && <p className="mt-2 text-sm text-foreground">{toDisplayText(category.nota)}</p>}
      <ul className="mt-4">
        {category.productos.map((product) => {
          return <MenuItem key={product.nombre} product={product} />
        })}
      </ul>
    </section>
  )
}
