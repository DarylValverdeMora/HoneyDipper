import type { FC } from 'react'
import type { MenuProduct } from '../../../data/menu.types'
import { toDisplayText } from '../../../lib/menu'
import { describePrice, formatPrice } from '../../../lib/price'
import { useMenu } from './menu-context'

type MenuItemProps = {
  product: MenuProduct
}

const formatOptions = (options: readonly string[]): string => {
  if (options.length < 2) return options.join('')
  return `${options.slice(0, -1).join(', ')} o ${options[options.length - 1] ?? ''}`
}

/** Fila de un plato: nombre a la izquierda, precio a la derecha y la descripción completa debajo. */
export const MenuItem: FC<MenuItemProps> = ({ product }) => {
  const { state } = useMenu()
  const showReviewNote = state.isReviewMode && product.porConfirmar !== undefined

  return (
    <li className="border-b border-menu-rule py-4 last:border-b-0">
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="dish-name text-xl leading-snug text-foreground">{product.nombre}</h4>
        <p className="price shrink-0 text-right font-medium text-menu-price">
          <span aria-hidden="true">{formatPrice(product.precio)}</span>
          <span className="sr-only">{describePrice(product.precio)}</span>
        </p>
      </div>
      {product.descripcion !== undefined && (
        <p className="mt-1 text-menu text-foreground">{toDisplayText(product.descripcion)}</p>
      )}
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
