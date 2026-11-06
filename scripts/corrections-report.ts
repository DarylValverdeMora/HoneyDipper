/**
 * npm run docs:correcciones — genera docs/correcciones-menu.md con cada corrección aplicada:
 * texto original, corregido y en qué producto o nota aparece. Falla si una corrección no se usa.
 */
import { writeFileSync } from 'node:fs'
import { menu } from '../src/data/menu.ts'
import { menuCorrections } from '../src/data/menu-corrections.ts'
import type { SpellingCorrection } from '../src/data/menu-corrections.ts'
import { countCorrectionMatches, listProducts } from '../src/lib/menu.ts'

type TextSource = { where: string; text: string }

const OUTPUT_PATH = new URL('../docs/correcciones-menu.md', import.meta.url)

const collectDisplayTexts = (): TextSource[] => {
  const notes = menu.flatMap((group) =>
    group.categorias.flatMap((category) =>
      category.nota === undefined ? [] : [{ where: `${category.nombre} (nota de la categoría)`, text: category.nota }],
    ),
  )
  const descriptions = listProducts(menu).flatMap(({ category, product }) =>
    product.descripcion === undefined ? [] : [{ where: `${category.nombre} > ${product.nombre}`, text: product.descripcion }],
  )
  return [...notes, ...descriptions]
}

const rowsFor = (correction: SpellingCorrection, sources: TextSource[]): string[] => {
  return sources
    .filter((source) => countCorrectionMatches(source.text, correction) > 0)
    .map((source) => `| ${correction.original} | ${correction.corregido} | ${source.where} |`)
}

const sources = collectDisplayTexts()
const rowsByCorrection = menuCorrections.map((correction) => ({ correction, rows: rowsFor(correction, sources) }))
const unused = rowsByCorrection.filter(({ rows }) => rows.length === 0)
const allRows = rowsByCorrection.flatMap(({ rows }) => rows)

const document = `# Correcciones del menú

Archivo generado con \`npm run docs:correcciones\`. No editar a mano.

Regla aprobada por Daryl: se corrige solo el texto que se muestra (descripciones y notas). Los
**nombres de los platos se dejan como están** (por ejemplo "Hawaina", "Capresse", "Expresso",
"Capuccino", "Té caliente ó frío"). El texto original queda intacto en \`src/data/menu.ts\`; las
correcciones viven en \`src/data/menu-corrections.ts\` y se aplican al mostrar. Para que el dueño
rechace una, se borra su fila en ese archivo y se vuelve a generar este documento.

Total: ${allRows.length} correcciones en ${menuCorrections.length} reglas.

| Original | Corregido | Dónde |
| --- | --- | --- |
${allRows.join('\n')}

## Pendientes de decidir con el dueño (no se corrigen)

- "Camarón saltado" en Montaditos > Camarón (en Ensaladas dice "salteado").
- "Lechuga, tomate atún arreglado" en Sandwiches > Atún (parece faltar una coma).
`

writeFileSync(OUTPUT_PATH, document)
process.stdout.write(`docs/correcciones-menu.md: ${allRows.length} correcciones\n`)

if (unused.length > 0) {
  process.stderr.write(`Correcciones sin uso: ${unused.map(({ correction }) => correction.original).join(', ')}\n`)
  process.exit(1)
}
