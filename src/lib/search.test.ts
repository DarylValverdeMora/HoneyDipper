import { describe, expect, it } from 'vitest'
import { menu } from '../data/menu'
import { getVisibleGroups } from './menu'
import { buildSearchIndex, normalizeForSearch, searchMenu } from './search'

const index = buildSearchIndex(getVisibleGroups(menu, { mostrarMenuMexicano: true }))
const namesFor = (query: string): string[] => searchMenu(index, query).map((entry) => entry.product.nombre)

describe('normalizeForSearch', () => {
  it('quita tildes y mayúsculas', () => {
    expect(normalizeForSearch('Café CON Piña')).toBe('cafe con pina')
  })
})

describe('searchMenu', () => {
  it('"cafe" encuentra platos con "Café"', () => {
    const names = namesFor('cafe')
    expect(names.length).toBeGreaterThan(0)
    expect(names.some((name) => name.includes('Café'))).toBe(true)
  })

  it('no importan tildes ni mayúsculas en lo que se escribe', () => {
    expect(namesFor('CAFÉ')).toEqual(namesFor('cafe'))
    expect(namesFor('Sándwich')).toEqual(namesFor('sandwich'))
  })

  it('encuentra partes de palabras', () => {
    expect(namesFor('hambur').length).toBeGreaterThan(0)
    expect(namesFor('chimi')).toEqual(['Chimichanga', 'Chimichanga'])
  })

  it('"birria" encuentra todos los platos con birria, en nombre o descripción', () => {
    const results = searchMenu(index, 'birria')
    const expected = index.filter((entry) => entry.haystack.includes('birria'))
    expect(results).toHaveLength(expected.length)
    expect(results.map((entry) => entry.product.nombre)).toEqual(
      expect.arrayContaining(['Empanada de birria', 'Tacos de birria', 'Quesabirria']),
    )
  })

  it('"mango" encuentra la soda italiana Mango strawberry', () => {
    const results = searchMenu(index, 'mango')
    expect(results.some((entry) => entry.product.nombre === 'Mango strawberry' && entry.categoryId === 'sodas-italianas')).toBe(true)
  })

  it('cada resultado trae su grupo y categoría', () => {
    const [first] = searchMenu(index, 'quesabirria')
    expect(first?.groupLabel).toBe('Comidas')
    expect(first?.categoryName).toBe('Menú mexicano')
  })

  it('una palabra sin resultados devuelve una lista vacía', () => {
    expect(searchMenu(index, 'sushi')).toEqual([])
  })

  it('una búsqueda vacía no devuelve nada', () => {
    expect(searchMenu(index, '   ')).toEqual([])
  })
})

describe('menú sin el menú mexicano', () => {
  it('no encuentra los platos ocultos', () => {
    const hidden = buildSearchIndex(getVisibleGroups(menu, { mostrarMenuMexicano: false }))
    expect(searchMenu(hidden, 'quesabirria')).toEqual([])
  })
})
