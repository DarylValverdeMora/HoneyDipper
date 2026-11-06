/** Secciones de la página. Los ids son los anclajes que usan el header y el botón flotante. */
/** 'lugar' no está en el menú de navegación, pero sí tiene anclaje. 'horario' es el bloque del pie de página. */
export const SECTION_IDS = ['inicio', 'menu', 'pasteleria', 'eventos', 'lugar', 'como-llegar', 'horario'] as const
export type SectionId = (typeof SECTION_IDS)[number]

export type NavLink = {
  label: string
  sectionId: SectionId
}

export const navLinks = [
  { label: 'Menú', sectionId: 'menu' },
  { label: 'Pastelería', sectionId: 'pasteleria' },
  { label: 'Eventos', sectionId: 'eventos' },
  { label: 'Cómo llegar', sectionId: 'como-llegar' },
] as const satisfies readonly NavLink[]

export const toAnchor = (sectionId: SectionId): `#${SectionId}` => {
  return `#${sectionId}`
}
