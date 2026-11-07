import { memo, useMemo } from 'react'
import type { FC } from 'react'
import type { MenuCategory as MenuCategoryData } from '../../../data/menu.types'
import { photosForSection } from '../../../data/photos'
import { categoryAnchorId, categoryTabId } from '../../../hooks/useMenuState'
import { cn } from '../../../lib/cn'
import { honeyDrop } from '../../../lib/honey-drop'
import { toDisplayText } from '../../../lib/menu'
import { ArchPhoto } from '../../ui/ArchFrame'
import { MenuItem } from './MenuItem'

/** Categorías con fondo propio en el menú impreso. */
const SURFACE_BY_CATEGORY: Partial<Record<MenuCategoryData['id'], 'hamburguesas'>> = {
  hamburguesas: 'hamburguesas',
}

type MenuCategoryProps = {
  category: MenuCategoryData
  isReviewMode: boolean
  /** Si el grupo tiene varias categorías, esta sección es el panel de su chip (pestaña). */
  isTabPanel?: boolean
}

type CategoryPhotosProps = {
  category: MenuCategoryData
}

/** Fotos chicas de la categoría (plan 2A). 128 px de ancho: ninguna foto se agranda más que su tamaño real. */
const CategoryPhotos: FC<CategoryPhotosProps> = ({ category }) => {
  const categoryPhotos = useMemo(() => photosForSection(`menu-${category.id}`), [category.id])
  if (categoryPhotos.length === 0) return null

  return (
    <div className="flex shrink-0 gap-3">
      {categoryPhotos.map((photo) => {
        return <ArchPhoto key={photo.src} photo={photo} className="aspect-4/5 w-32" />
      })}
    </div>
  )
}

const MenuCategorySection: FC<MenuCategoryProps> = ({ category, isReviewMode, isTabPanel = false }) => {
  const surface = SURFACE_BY_CATEGORY[category.id]
  const titleId = `${categoryAnchorId(category.id)}-titulo`

  return (
    <section
      id={categoryAnchorId(category.id)}
      role={isTabPanel ? 'tabpanel' : undefined}
      aria-labelledby={isTabPanel ? categoryTabId(category.id) : titleId}
      data-menu-surface={surface}
      className={cn(
        'scroll-mt-menu-anchor py-8 md:py-10',
        surface !== undefined && 'my-4 rounded-3xl bg-menu-surface px-4 md:px-8',
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 id={titleId} {...honeyDrop} className="text-4xl italic">
            {category.nombre}
          </h3>
          {category.nota !== undefined && <p className="mt-2 text-sm text-foreground">{toDisplayText(category.nota)}</p>}
        </div>
        <CategoryPhotos category={category} />
      </div>
      <ul className="mt-4 lg:grid lg:grid-cols-2 lg:gap-x-12">
        {category.productos.map((product) => {
          return <MenuItem key={product.nombre} categoryId={category.id} product={product} isReviewMode={isReviewMode} />
        })}
      </ul>
    </section>
  )
}

export const MenuCategory = memo(MenuCategorySection)
