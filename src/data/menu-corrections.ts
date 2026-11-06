/**
 * Correcciones de ortografía aprobadas para mostrar (etapa 2C). Se aplican solo a descripciones
 * y notas, nunca a nombres de platos. El texto original queda intacto en menu.ts.
 * Para quitar una corrección que el dueño no apruebe, se borra su fila.
 * El detalle de dónde se aplica cada una se genera en docs/correcciones-menu.md (npm run docs:correcciones).
 */
export type SpellingCorrection = {
  original: string
  corregido: string
}

export const menuCorrections: readonly SpellingCorrection[] = [
  { original: 'Ensalda', corregido: 'Ensalada' },
  { original: 'ensalda', corregido: 'ensalada' },
  { original: 'soble', corregido: 'doble' },
  { original: 'poodoro', corregido: 'pomodoro' },
  { original: 'adearezo', corregido: 'aderezo' },
  { original: 'Turrilaba', corregido: 'Turrialba' },
  { original: 'acosto', corregido: 'costo' },
  { original: 'duce de leche', corregido: 'dulce de leche' },
  { original: 'chill – beans', corregido: 'chili beans' },
  { original: 'marshmellows', corregido: 'marshmallows' },
  { original: 'mozarella', corregido: 'mozzarella' },
]
