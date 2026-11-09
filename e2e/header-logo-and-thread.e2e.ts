import { expect, test } from '@playwright/test'
import { waitForFullPage } from './layout-helpers'
import type { Page } from '@playwright/test'

const headerLogo = (page: Page) => page.locator('header a[href="#inicio"]')

/** Punto de partida del trazo (M x y) y punta de la gota, en coordenadas del contenedor del hilo. */
const readThreadStart = (page: Page) => {
  return page.evaluate(() => {
    const line = document.querySelector('[data-honey-thread-line]')
    const marker = document.querySelector('[data-honey-thread-start]')
    const scope = line?.closest('svg')?.parentElement
    if (!line || !marker || !scope) return null
    const match = /^M (\S+) (\S+)/.exec(line.getAttribute('d') ?? '')
    const scopeRect = scope.getBoundingClientRect()
    const markerRect = marker.getBoundingClientRect()
    return {
      pathX: Number(match?.[1]),
      pathY: Number(match?.[2]),
      tipX: markerRect.left - scopeRect.left,
      tipY: markerRect.top - scopeRect.top,
    }
  })
}

/** Largo dibujado del hilo (largo total − dashoffset). */
const readDrawnLength = (page: Page) => {
  return page.evaluate(() => {
    const line = document.querySelector<SVGPathElement>('[data-honey-thread-line]')
    if (!line) return 0
    return line.getTotalLength() - Number(line.style.strokeDashoffset || 0)
  })
}

test.describe('escritorio', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  for (const width of [768, 1024, 1440]) {
    test(`el logo del header se ve siempre a ${width} px, también con el hero a la vista`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('./')
      await waitForFullPage(page)
      await expect(headerLogo(page)).toBeVisible()
      await expect(headerLogo(page)).toHaveCSS('opacity', '1')
      await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }))
      await expect(headerLogo(page)).toBeVisible()
    })
  }
})

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test.describe(`movimiento: ${reducedMotion}`, () => {
    test.use({ viewport: { width: 375, height: 667 }, hasTouch: true, reducedMotion })

    test('el logo del header aparece solo cuando el logo grande salió de la pantalla', async ({ page }) => {
      await page.goto('./')
      await waitForFullPage(page)
      await expect(headerLogo(page)).toBeHidden()

      await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }))
      await expect(headerLogo(page)).toBeVisible()

      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      await expect(headerLogo(page)).toBeHidden()
    })

    test('el hilo nace en la punta de la gota y el tramo hasta el riel queda dibujado', async ({ page }) => {
      await page.goto('./')
      await waitForFullPage(page)
      await page.waitForTimeout(2500)

      const start = await readThreadStart(page)
      expect(start).not.toBeNull()
      if (start === null) return
      expect(Math.abs(start.pathX - start.tipX)).toBeLessThan(1)
      expect(Math.abs(start.pathY - start.tipY)).toBeLessThan(1)

      // Con scroll en 0, lo dibujado ya pasa de la gota al riel (la unión no queda suelta).
      const introLength = await page.evaluate(() => {
        const line = document.querySelector<SVGPathElement>('[data-honey-thread-line]')
        const d = line?.getAttribute('d') ?? ''
        const railStart = /Q \S+ \S+ (\S+) (\S+) L \S+ \S+$/.exec(d)
        if (!line || !railStart) return Number.POSITIVE_INFINITY
        const probe = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        probe.setAttribute('d', d.replace(/ L \S+ \S+$/, ''))
        return probe.getTotalLength()
      })
      expect(await readDrawnLength(page)).toBeGreaterThanOrEqual(introLength - 1)
    })

    test('con scroll avanzado, el hilo sigue unido a la gota y crece con el scroll', async ({ page }) => {
      await page.goto('./')
      await waitForFullPage(page)
      await page.waitForTimeout(2500)
      await page.evaluate(() => window.scrollTo({ top: 2400, behavior: 'instant' }))
      await page.waitForTimeout(1500)
      const start = await readThreadStart(page)
      expect(start).not.toBeNull()
      if (start === null) return
      expect(Math.abs(start.pathY - start.tipY)).toBeLessThan(1)
      expect(await readDrawnLength(page)).toBeGreaterThan(400)
    })
  })
}
