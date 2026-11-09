import { expect, test } from '@playwright/test'
import { enlargeText, headerReserveButton, measureOverflow, PHONE_WIDTHS, waitForFullPage } from './layout-helpers'
import type { Page } from '@playwright/test'

const SCROLL_STEP_RATIO = 0.8
const SHEET_TRIGGERS = [
  { name: 'reserva', selector: '#inicio [data-flow="reserva"]' },
  { name: 'pastel', selector: '#inicio [data-flow="pastel"]' },
  { name: 'evento', selector: '[data-flow="evento"]' },
  { name: 'menú del celular', selector: 'header button[aria-label="Abrir menú"]' },
] as const

const expectNoHorizontalOverflow = async (page: Page, where: string): Promise<void> => {
  const overflow = await measureOverflow(page)
  expect(overflow.offenders, `elementos que se salen (${where})`).toEqual([])
  expect(overflow.pageScrollWidth, `scroll horizontal (${where})`).toBeLessThanOrEqual(overflow.viewportWidth)
}

/** Baja la página de a 80 % de pantalla y revisa el ancho en cada parada. */
const walkWholePage = async (page: Page): Promise<void> => {
  const { scrollHeight, viewportHeight } = await page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight,
  }))
  const step = Math.round(viewportHeight * SCROLL_STEP_RATIO)
  for (let y = 0; y <= scrollHeight; y += step) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
    await expectNoHorizontalOverflow(page, `scroll ${y}`)
  }
}

const textSizes = [
  { label: 'texto normal', percent: 100 },
  { label: 'texto del sistema al 130 %', percent: 130 },
] as const

for (const { label, percent } of textSizes) {
  test.describe(`celular, ${label}`, () => {
    test.use({ reducedMotion: 'reduce', hasTouch: true })

    for (const width of PHONE_WIDTHS) {
      test(`sin scroll horizontal a ${width} px, en toda la página y con las hojas abiertas`, async ({ page }) => {
        await page.setViewportSize({ width, height: 740 })
        await page.goto('./')
        if (percent !== 100) await enlargeText(page, percent)
        await waitForFullPage(page)

        await walkWholePage(page)

        for (const trigger of SHEET_TRIGGERS) {
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
          const button = page.locator(trigger.selector).first()
          await button.scrollIntoViewIfNeeded()
          await button.click()
          const dialog = page.locator('dialog[open]')
          await expect(dialog).toBeVisible()
          await expectNoHorizontalOverflow(page, `hoja ${trigger.name}`)
          await page.keyboard.press('Escape')
          await expect(dialog).toHaveCount(0)
        }
      })

      test(`"Reservar mesa" del header se ve completo y en una línea a ${width} px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 740 })
        await page.goto('./')
        if (percent !== 100) await enlargeText(page, percent)
        await waitForFullPage(page)

        const button = headerReserveButton(page)
        await expect(button).toBeVisible()
        await expect(button).toHaveText('Reservar mesa')
        const box = await button.boundingBox()
        expect(box).not.toBeNull()
        if (box === null) return
        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(width)

        const lineCount = await button.evaluate((element) => {
          const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || parseFloat(getComputedStyle(element).fontSize) * 1.5
          const range = document.createRange()
          range.selectNodeContents(element)
          return Math.round(range.getBoundingClientRect().height / lineHeight)
        })
        expect(lineCount).toBe(1)

        const menuButton = page.getByRole('button', { name: 'Abrir menú' })
        await expect(menuButton).toBeVisible()
        const menuBox = await menuButton.boundingBox()
        expect(menuBox === null ? Number.POSITIVE_INFINITY : menuBox.x + menuBox.width).toBeLessThanOrEqual(width)
      })
    }
  })
}

test.describe('primera pantalla en 375 × 667', () => {
  test.use({ viewport: { width: 375, height: 667 }, hasTouch: true })

  test('se ven el slogan, los dos botones y el borde del arco sin hacer scroll', async ({ page }) => {
    await page.goto('./')
    await waitForFullPage(page)
    const fold = 667
    const slogan = await page.locator('[data-hero-slogan]').boundingBox()
    const pastel = await page.locator('#inicio [data-flow="pastel"]').boundingBox()
    const reserva = await page.locator('#inicio [data-flow="reserva"]').boundingBox()
    const arch = await page.locator('#inicio img').last().boundingBox()
    for (const box of [slogan, pastel, reserva]) {
      expect(box === null ? Number.POSITIVE_INFINITY : box.y + box.height).toBeLessThanOrEqual(fold)
    }
    expect(arch === null ? Number.POSITIVE_INFINITY : arch.y).toBeLessThan(fold - 40)
  })
})
