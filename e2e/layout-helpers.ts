import type { Page } from '@playwright/test'

/** Anchos de celular que se prueban: del más angosto (320) al iPhone grande (430). */
export const PHONE_WIDTHS = [320, 360, 375, 390, 430] as const

/** El botón del header (el del menú del celular vive en una hoja cerrada, fuera del árbol accesible). */
export const headerReserveButton = (page: Page) => page.getByRole('banner').getByRole('button', { name: 'Reservar mesa' })

export type Overflow = {
  pageScrollWidth: number
  viewportWidth: number
  /** Elementos que se salen por los lados y no están dentro de un contenedor que los recorte. */
  offenders: string[]
}

/** Mide si la página tiene scroll horizontal y qué elementos lo causan. */
export const measureOverflow = (page: Page): Promise<Overflow> => {
  return page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth
    const clips = (element: Element): boolean => {
      const { overflowX } = getComputedStyle(element)
      return overflowX !== 'visible'
    }
    const isClipped = (element: Element): boolean => {
      let parent = element.parentElement
      while (parent !== null && parent !== document.body) {
        if (clips(parent)) return true
        parent = parent.parentElement
      }
      return false
    }
    const offenders: string[] = []
    for (const element of document.querySelectorAll('body *')) {
      const rect = element.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) continue
      if (getComputedStyle(element).visibility === 'hidden') continue
      const isOutside = rect.right > viewportWidth + 0.5 || rect.left < -0.5
      if (!isOutside || isClipped(element)) continue
      const className = element.getAttribute('class') ?? ''
      offenders.push(`${element.tagName.toLowerCase()} [${Math.round(rect.left)}, ${Math.round(rect.right)}] ${className.slice(0, 60)}`)
    }
    return { pageScrollWidth: document.documentElement.scrollWidth, viewportWidth, offenders }
  })
}

/** Simula el texto del sistema más grande: todo lo que usa rem crece en esa proporción. */
export const enlargeText = async (page: Page, percent: number): Promise<void> => {
  await page.addStyleTag({ content: `html { font-size: ${percent}% !important; }` })
}

/** Espera a que se monte el resto de la página (se agrega después del primer pintado). */
export const waitForFullPage = async (page: Page): Promise<void> => {
  await page.locator('footer').waitFor({ state: 'attached' })
  await page.evaluate(() => document.fonts.ready)
}
