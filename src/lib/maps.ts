type Coordinates = {
  lat: number
  lng: number
}

const EMBED_ZOOM = 17

/** Mapa embebible de Google sin clave de API, centrado en el negocio. */
export const buildMapEmbedUrl = ({ lat, lng }: Coordinates): string => {
  const params = new URLSearchParams({ q: `${lat},${lng}`, z: String(EMBED_ZOOM), output: 'embed', hl: 'es' })
  return `https://maps.google.com/maps?${params.toString()}`
}
