import type { MenuCategoryId } from './menu.types'

/**
 * Cambios de CONTENIDO del menú (no de ortografía): el dueño cambió qué dice un plato.
 * El texto original queda intacto en menu.ts; aquí va el nuevo, que es el que se muestra.
 * `original` debe coincidir con menu.ts, si no el cambio no se aplica y el reporte falla.
 */
export type ContentChange = {
  categoryId: MenuCategoryId
  producto: string
  original: string
  nuevo: string
  motivo: string
  /** El dueño debe aprobar el texto exacto antes de publicar. */
  aprobacion: 'pendiente' | 'aprobado'
}

export const menuContentChanges: readonly ContentChange[] = [
  {
    categoryId: 'sodas-italianas',
    producto: 'Mango strawberry',
    original: 'Bebida carbonatada con reducción de frutos rojos o maracuyá.',
    nuevo: 'Bebida carbonatada con mango y reducción de frutos rojos o maracuyá.',
    motivo: 'El dueño confirmó que sí lleva mango (2026-11-06). La descripción original era igual a la de la Clásica.',
    aprobacion: 'pendiente',
  },
]
