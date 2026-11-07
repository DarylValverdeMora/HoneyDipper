import { describe, expect, it } from 'vitest'
import { menu } from '../data/menu'
import { getVisibleGroups } from './menu'
import { initialSelection, nextStep, requireGroups, resolveSelection, selectCategory, selectExact, selectGroup } from './menu-selection'

const groups = requireGroups(getVisibleGroups(menu))
const start = initialSelection(groups)

describe('selección del menú por categoría', () => {
  it('abre con la primera categoría del primer grupo', () => {
    expect(start).toEqual({ groupId: 'comidas', categoryId: 'entradas' })
  })

  it('al entrar a un grupo abre su primera categoría', () => {
    expect(selectGroup(groups, start, 'bebidas')).toEqual({ groupId: 'bebidas', categoryId: 'bebidas-calientes' })
    expect(selectGroup(groups, start, 'dulces')).toEqual({ groupId: 'dulces', categoryId: 'crepas' })
  })

  it('cambia de categoría solo dentro del grupo activo', () => {
    expect(selectCategory(groups, start, 'hamburguesas')).toEqual({ groupId: 'comidas', categoryId: 'hamburguesas' })
    expect(selectCategory(groups, start, 'frappes')).toEqual(start)
  })

  it('la búsqueda selecciona grupo y categoría a la vez', () => {
    expect(selectExact(groups, start, { groupId: 'bebidas', categoryId: 'frappes' })).toEqual({
      groupId: 'bebidas',
      categoryId: 'frappes',
    })
    expect(selectExact(groups, start, { groupId: 'bebidas', categoryId: 'entradas' })).toEqual(start)
  })

  it('si la categoría ya no existe, muestra la primera del grupo', () => {
    const withoutMexican = requireGroups(getVisibleGroups(menu, { mostrarMenuMexicano: false }))
    const { category } = resolveSelection(withoutMexican, { groupId: 'comidas', categoryId: 'menu-mexicano' })
    expect(category.id).toBe('entradas')
  })
})

describe('botón "Siguiente"', () => {
  it('lleva a la categoría que sigue dentro del grupo', () => {
    expect(nextStep(groups, start)).toEqual({
      kind: 'categoria',
      selection: { groupId: 'comidas', categoryId: 'ensaladas' },
      label: 'Ensaladas',
    })
  })

  it('en la última categoría del grupo lleva a la primera del grupo siguiente', () => {
    const step = nextStep(groups, { groupId: 'comidas', categoryId: 'menu-mexicano' })
    expect(step.kind).toBe('grupo')
    expect(step.selection).toEqual({ groupId: 'brunch', categoryId: 'brunch' })
  })

  it('un grupo de una sola categoría pasa directo al siguiente grupo', () => {
    expect(nextStep(groups, { groupId: 'dulces', categoryId: 'crepas' }).selection).toEqual({
      groupId: 'bebidas',
      categoryId: 'bebidas-calientes',
    })
  })

  it('al final del último grupo vuelve al inicio del menú', () => {
    const step = nextStep(groups, { groupId: 'ninos', categoryId: 'menu-ninos' })
    expect(step).toEqual({ kind: 'inicio', selection: start, label: 'Entradas' })
  })

  it('recorre todas las categorías sin saltarse ninguna ni repetir', () => {
    const visited = [start.categoryId]
    let current = start
    for (;;) {
      const step = nextStep(groups, current)
      if (step.kind === 'inicio') break
      current = step.selection
      visited.push(current.categoryId)
    }
    const all = groups.flatMap((group) => group.categorias.map((category) => category.id))
    expect(visited).toEqual(all)
  })
})
