import { describe, expect, it } from 'vitest'
import { menu } from '../data/menu'
import { countProductsByGroup, getDisplayDescription, getVisibleGroups, listProducts, toDisplayText } from './menu'

describe('toDisplayText', () => {
  it('corrige solo palabras completas y conserva el resto del texto', () => {
    expect(toDisplayText('Ensalda de la casa, queso mozarella y adearezo de la casa.')).toBe(
      'Ensalada de la casa, queso mozzarella y aderezo de la casa.',
    )
    expect(toDisplayText('queso mozzarella')).toBe('queso mozzarella')
    expect(toDisplayText('Pan brioche, chill – beans, carne')).toBe('Pan brioche, chili beans, carne')
    expect(toDisplayText('Pan brioche, lechuga , tomate , chill – beans,  carne')).toBe(
      'Pan brioche, lechuga, tomate, chili beans,  carne',
    )
    expect(toDisplayText('queso mozarella y peperoni.')).toBe('queso mozzarella y pepperoni.')
  })
})

describe('getVisibleGroups', () => {
  it('oculta el menú mexicano con una sola bandera', () => {
    const counts = countProductsByGroup(getVisibleGroups(menu, { mostrarMenuMexicano: false }))
    expect(counts.comidas).toBe(75)
    const names = listProducts(getVisibleGroups(menu, { mostrarMenuMexicano: false })).map(({ category }) => category.id)
    expect(names).not.toContain('menu-mexicano')
  })
})

describe('menu', () => {
  it('no repite nombres dentro de una misma categoría', () => {
    menu.forEach((group) =>
      group.categorias.forEach((category) => {
        const names = category.productos.map((product) => product.nombre)
        expect(new Set(names).size).toBe(names.length)
      }),
    )
  })
})

describe('cambios de contenido', () => {
  it('muestra la descripción nueva de Mango strawberry y deja el original en los datos', () => {
    const location = listProducts(menu).find(({ product }) => product.nombre === 'Mango strawberry')
    expect(location?.product.descripcion).toBe('Bebida carbonatada con reducción de frutos rojos o maracuyá.')
    expect(location === undefined ? undefined : getDisplayDescription(location.category.id, location.product)).toBe(
      'Bebida carbonatada con mango y reducción de frutos rojos o maracuyá.',
    )
  })
})
