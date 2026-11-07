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
} as const
