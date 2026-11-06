import { memo } from 'react'
import type { FC } from 'react'
import type { MenuCategoryId, MenuProduct } from '../../../data/menu.types'
import { productAnchorId } from '../../../hooks/useMenuState'
import { getDisplayDescription } from '../../../lib/menu'
import { describePrice, formatPrice } from '../../../lib/price'

type MenuItemProps = {
  categoryId: MenuCategoryId
  product: MenuProduct
  isReviewMode: boolean
}

const formatOptions = (options: readonly string[]): string => {
  if (options.length < 2) return options.join('')
  return `${options.slice(0, -1).join(', ')} o ${options[options.length - 1] ?? ''}`
}

/** Fila de un plato: nombre a la izquierda, precio a la derecha y la descripción completa debajo. */
const MenuItemRow: FC<MenuItemProps> = ({ categoryId, product, isReviewMode }) => {
  const description = getDisplayDescription(categoryId, product)
  const showReviewNote = isReviewMode && product.porConfirmar !== undefined

  return (
    <li
      id={productAnchorId(categoryId, product.nombre)}
      tabIndex={-1}
      className="scroll-mt-menu-anchor border-b border-menu-rule py-4 transition-[background-color] duration-500 ease-out data-highlighted:bg-surface-soft"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="dish-name text-xl leading-snug text-foreground">{product.nombre}</h4>
        <p className="price shrink-0 text-right font-medium text-menu-price">
          <span aria-hidden="true">{formatPrice(product.precio)}</span>
          <span className="sr-only">{describePrice(product.precio)}</span>
        </p>
      </div>
      {description !== undefined && <p className="mt-1 text-menu text-foreground">{description}</p>}
      {product.formato !== undefined && (
        <p className="mt-1 text-sm text-foreground">A escoger: {formatOptions(product.formato)}</p>
      )}
      {showReviewNote && (
        <p className="mt-2 rounded-lg bg-surface px-3 py-2 text-xs text-foreground shadow-raised">
          Por confirmar: {product.porConfirmar}
        </p>
      )}
    </li>
  )
}

/** Memorizado: el scroll-spy y la búsqueda no vuelven a pintar las filas. */
export const MenuItem = memo(MenuItemRow)
