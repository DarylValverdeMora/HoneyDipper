/**
 * Ajustes del sitio que viven en el <head>. Se leen al hacer la build (vite.config.ts).
 */
export const site = {
  /**
   * [PLACEHOLDER] Prototipo: false hasta que el cliente apruebe. En false, la página lleva
   * <meta name="robots" content="noindex, nofollow"> y los buscadores no la muestran.
   * Al publicar la versión final, cambiar a true (y nada más).
   */
  indexable: false,
  /**
   * [PLACEHOLDER] URL pública del sitio, sin barra final (por ejemplo "https://honey-dipper.vercel.app").
   * Con valor, la build agrega canonical y og:url y deja og:image y twitter:image con URL absoluta, que es lo
   * que WhatsApp, Facebook y X necesitan para mostrar la imagen. Vacío mientras no haya despliegue.
   */
  url: '',
} as const
