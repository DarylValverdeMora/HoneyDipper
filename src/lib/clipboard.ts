/** El navegador no deja copiar: sin HTTPS, sin permiso o sin la API del portapapeles. */
export class ClipboardUnavailableError extends Error {
  constructor(options?: ErrorOptions) {
    super('No se pudo usar el portapapeles', options)
    this.name = 'ClipboardUnavailableError'
  }
}

/** Copia texto al portapapeles. Cualquier falla del navegador sale como ClipboardUnavailableError. */
export const writeToClipboard = async (text: string): Promise<void> => {
  if (!('clipboard' in navigator)) throw new ClipboardUnavailableError()
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    throw new ClipboardUnavailableError({ cause: error })
  }
}
