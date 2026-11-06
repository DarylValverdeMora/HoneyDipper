/**
 * npm run check:menu — cuenta productos por grupo y falla si no coinciden con el conteo verificado
 * contra la ficha. Cuenta el menú completo (todas las banderas encendidas).
 */
import { menu } from '../src/data/menu.ts'
import type { MenuFlag, MenuGroupId } from '../src/data/menu.types.ts'
import { countProductsByGroup, getVisibleGroups, listProductsToConfirm } from '../src/lib/menu.ts'

const EXPECTED: Record<MenuGroupId, number> = { comidas: 81, brunch: 19, dulces: 8, bebidas: 44, ninos: 6 }
const EXPECTED_TOTAL = 158
const ALL_FLAGS_ON: Record<MenuFlag, boolean> = { mostrarMenuMexicano: true }

const sum = (values: number[]): number => values.reduce((total, value) => total + value, 0)

const counts = countProductsByGroup(getVisibleGroups(menu, ALL_FLAGS_ON))
const groupIds = Object.keys(EXPECTED).filter((id): id is MenuGroupId => id in counts)
const mismatches = groupIds.filter((id) => counts[id] !== EXPECTED[id])
const total = sum(groupIds.map((id) => counts[id]))

groupIds.forEach((id) => {
  const mark = counts[id] === EXPECTED[id] ? 'ok' : `ESPERADO ${EXPECTED[id]}`
  process.stdout.write(`${id.padEnd(8)} ${String(counts[id]).padStart(3)}  ${mark}\n`)
})
process.stdout.write(`total    ${String(total).padStart(3)}  ${total === EXPECTED_TOTAL ? 'ok' : `ESPERADO ${EXPECTED_TOTAL}`}\n\n`)

const toConfirm = listProductsToConfirm(menu)
process.stdout.write(`Por confirmar (${toConfirm.length}):\n`)
toConfirm.forEach(({ category, product }) => {
  process.stdout.write(`- ${category.nombre} > ${product.nombre}: ${product.porConfirmar ?? ''}\n`)
})

if (mismatches.length > 0 || total !== EXPECTED_TOTAL) {
  process.stderr.write('\nEl conteo del menú no coincide con lo verificado contra la ficha.\n')
  process.exit(1)
}
