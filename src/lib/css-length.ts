/** Lee una variable CSS en rem (por ejemplo --header-height) y la devuelve en píxeles. */
export const readRemVariablePx = (name: `--${string}`): number => {
  const root = document.documentElement
  const value = parseFloat(getComputedStyle(root).getPropertyValue(name))
  const rootFontSize = parseFloat(getComputedStyle(root).fontSize)
  if (Number.isNaN(value) || Number.isNaN(rootFontSize)) return 0
  return value * rootFontSize
}
