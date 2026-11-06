/**
 * Marca un elemento para que el hilo de miel forme una gotita a su altura.
 * Uso: <h2 {...honeyDrop}>Menú</h2>. El hilo vuelve a medir cuando cambia la página.
 */
export const HONEY_DROP_ATTRIBUTE = 'data-honey-drop'

export const honeyDrop = { [HONEY_DROP_ATTRIBUTE]: '' } as const
