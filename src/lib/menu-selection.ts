import type { MenuCategory, MenuCategoryId, MenuGroup, MenuGroupId } from '../data/menu.types'
import type { NonEmpty } from './types'

/** Qué se ve del menú: un grupo (pestaña) y una sola categoría de ese grupo. */
export type MenuSelection = {
  groupId: MenuGroupId
  categoryId: MenuCategoryId
}

/** A dónde lleva el botón del final de la categoría. */
export type NextStep =
  /** Otra categoría del mismo grupo. */
  | { kind: 'categoria'; selection: MenuSelection; label: string }
  /** La primera categoría del grupo siguiente. */
  | { kind: 'grupo'; selection: MenuSelection; label: string }
  /** Última categoría del último grupo: vuelve al principio para no terminar en un callejón. */
  | { kind: 'inicio'; selection: MenuSelection; label: string }

/** El menú siempre tiene al menos un grupo visible; si no, es un error de datos y se avisa al cargar. */
export const requireGroups = (groups: readonly MenuGroup[]): NonEmpty<MenuGroup> => {
  const [first, ...rest] = groups
  if (first === undefined) throw new Error('El menú no tiene grupos visibles.')
  return [first, ...rest]
}

const findGroup = (groups: readonly MenuGroup[], groupId: MenuGroupId): MenuGroup | undefined => {
  return groups.find((group) => group.id === groupId)
}

const firstOf = (group: MenuGroup): MenuSelection => {
  return { groupId: group.id, categoryId: group.categorias[0].id }
}

/** Al abrir la página: la primera categoría del primer grupo. */
export const initialSelection = (groups: NonEmpty<MenuGroup>): MenuSelection => {
  return firstOf(groups[0])
}

/** Al entrar a un grupo se abre su primera categoría. Un grupo desconocido deja todo como estaba. */
export const selectGroup = (groups: readonly MenuGroup[], current: MenuSelection, groupId: MenuGroupId): MenuSelection => {
  const group = findGroup(groups, groupId)
  return group === undefined ? current : firstOf(group)
}

/** Cambia de categoría dentro del grupo activo. Una categoría de otro grupo se ignora. */
export const selectCategory = (
  groups: readonly MenuGroup[],
  current: MenuSelection,
  categoryId: MenuCategoryId,
): MenuSelection => {
  const group = findGroup(groups, current.groupId)
  const belongs = group?.categorias.some((category) => category.id === categoryId) ?? false
  return belongs ? { groupId: current.groupId, categoryId } : current
}

/** Selección exacta (por ejemplo, desde la búsqueda): grupo y categoría a la vez, si existen juntos. */
export const selectExact = (groups: readonly MenuGroup[], current: MenuSelection, target: MenuSelection): MenuSelection => {
  const group = findGroup(groups, target.groupId)
  const exists = group?.categorias.some((category) => category.id === target.categoryId) ?? false
  return exists ? target : current
}

/** Grupo y categoría activos, con respaldo al primero si la selección ya no existe (por una bandera). */
export const resolveSelection = (
  groups: NonEmpty<MenuGroup>,
  selection: MenuSelection,
): { group: MenuGroup; category: MenuCategory } => {
  const group = findGroup(groups, selection.groupId) ?? groups[0]
  const category = group.categorias.find((item) => item.id === selection.categoryId) ?? group.categorias[0]
  return { group, category }
}

/** El paso siguiente al terminar de ver una categoría. */
export const nextStep = (groups: NonEmpty<MenuGroup>, selection: MenuSelection): NextStep => {
  const { group, category } = resolveSelection(groups, selection)
  const categoryIndex = group.categorias.indexOf(category)
  const nextCategory = group.categorias[categoryIndex + 1]
  if (nextCategory !== undefined) {
    return { kind: 'categoria', selection: { groupId: group.id, categoryId: nextCategory.id }, label: nextCategory.nombre }
  }

  const nextGroup = groups[groups.indexOf(group) + 1]
  if (nextGroup !== undefined) {
    return { kind: 'grupo', selection: firstOf(nextGroup), label: nextGroup.categorias[0].nombre }
  }

  const firstGroup = groups[0]
  return { kind: 'inicio', selection: firstOf(firstGroup), label: firstGroup.categorias[0].nombre }
}
