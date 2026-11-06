/**
 * Correcciones de ortografía aprobadas para mostrar. Se aplican solo a descripciones y notas,
 * nunca a nombres de platos. El texto original queda intacto en menu.ts.
 * Para quitar una corrección que el dueño no apruebe, se borra su fila.
 * El detalle de dónde se aplica cada una se genera en docs/correcciones-menu.md (npm run docs:correcciones).
 */
export type SpellingCorrection =
  /** Reemplaza una palabra o frase completa. */
  | { kind: 'palabra'; original: string; corregido: string }
  /** Reemplazo por patrón, para casos que no son una palabra (por ejemplo espacios). */
  | { kind: 'patron'; descripcion: string; original: string; corregido: string; patron: RegExp; reemplazo: string }

export const menuCorrections: readonly SpellingCorrection[] = [
  { kind: 'palabra', original: 'Ensalda', corregido: 'Ensalada' },
  { kind: 'palabra', original: 'ensalda', corregido: 'ensalada' },
  { kind: 'palabra', original: 'soble', corregido: 'doble' },
  { kind: 'palabra', original: 'poodoro', corregido: 'pomodoro' },
  { kind: 'palabra', original: 'adearezo', corregido: 'aderezo' },
  { kind: 'palabra', original: 'Turrilaba', corregido: 'Turrialba' },
  { kind: 'palabra', original: 'acosto', corregido: 'costo' },
  { kind: 'palabra', original: 'duce de leche', corregido: 'dulce de leche' },
  { kind: 'palabra', original: 'chill – beans', corregido: 'chili beans' },
  { kind: 'palabra', original: 'marshmellows', corregido: 'marshmallows' },
  { kind: 'palabra', original: 'mozarella', corregido: 'mozzarella' },
  { kind: 'palabra', original: 'peperoni', corregido: 'pepperoni' },
  {
    kind: 'patron',
    descripcion: 'Espacios antes de una coma',
    original: '" ,"',
    corregido: '","',
    patron: / +,/gu,
    reemplazo: ',',
  },
]
