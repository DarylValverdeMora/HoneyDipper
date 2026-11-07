import { useEffect } from 'react'
import type { RefObject } from 'react'
import { loadMotion } from '../lib/load-motion'
import type { MotionRuntime } from '../lib/load-motion'
import { HONEY_DROP_ATTRIBUTE } from '../lib/honey-drop'
import { buildDropletPath, buildThreadPath, drawnLengthAt, railXFor } from '../lib/honey-thread'
import { EASE_FALL, EASE_OUT, LOAD_SEQUENCE, THREAD_SCRUB_SECONDS } from '../lib/motion'

/** La punta del hilo va a esta altura de la pantalla mientras se hace scroll. */
const TIP_VIEWPORT_RATIO = 0.6

/** Clases de cada gotita. Se crean desde aquí para que Tailwind las encuentre. */
const DROPLET_CLASS =
  'origin-top scale-0 fill-honey opacity-0 transition-[scale,opacity] duration-300 ease-out transform-fill data-shown:scale-100 data-shown:opacity-100'

const SVG_NS = 'http://www.w3.org/2000/svg'

type Droplet = { node: SVGPathElement; y: number; isShown: boolean }

type ThreadState = {
  total: number
  introLength: number
  railStartY: number
  bottom: number
  /** 0 a 1: cuánto de la curva de entrada ya se dibujó en la carga. */
  introProgress: number
  /** y de la punta del hilo, relativa al contenedor. */
  tipY: number
  droplets: Droplet[]
}

type ThreadElements = {
  scope: HTMLElement
  line: SVGPathElement
  dropletLayer: SVGGElement
  startMarker: HTMLElement
  railReference: HTMLElement
}

const findElements = (scope: HTMLElement): ThreadElements | null => {
  const line = scope.querySelector<SVGPathElement>('[data-honey-thread-line]')
  const dropletLayer = scope.querySelector<SVGGElement>('[data-honey-droplets]')
  const startMarker = scope.querySelector<HTMLElement>('[data-honey-thread-start]')
  const railReference = scope.querySelector<HTMLElement>('[data-honey-rail]')
  if (line === null || dropletLayer === null || startMarker === null || railReference === null) return null
  return { scope, line, dropletLayer, startMarker, railReference }
}

const createDroplets = (elements: ThreadElements, railX: number, scopeTop: number): Droplet[] => {
  elements.dropletLayer.replaceChildren()
  const targets = Array.from(elements.scope.querySelectorAll<HTMLElement>(`[${HONEY_DROP_ATTRIBUTE}]`))
  return targets.map((target) => {
    const y = target.getBoundingClientRect().top - scopeTop
    const node = document.createElementNS(SVG_NS, 'path')
    node.setAttribute('d', buildDropletPath({ x: railX, y }))
    node.setAttribute('class', DROPLET_CLASS)
    elements.dropletLayer.append(node)
    return { node, y, isShown: false }
  })
}

/** Mide la página y rehace el trazo. Corre al montar y antes de cada refresh de ScrollTrigger. */
const measure = (elements: ThreadElements, state: ThreadState): void => {
  const scopeRect = elements.scope.getBoundingClientRect()
  const markerRect = elements.startMarker.getBoundingClientRect()
  const railRect = elements.railReference.getBoundingClientRect()
  const gutter = parseFloat(getComputedStyle(elements.railReference).paddingLeft)
  const railX = railXFor(railRect.left - scopeRect.left, gutter)
  const bottom = scopeRect.height

  const { d, railStartY } = buildThreadPath({
    start: { x: markerRect.left - scopeRect.left, y: markerRect.top - scopeRect.top },
    railX,
    bottom,
  })
  elements.line.setAttribute('d', d)

  const total = elements.line.getTotalLength()
  state.total = total
  state.railStartY = railStartY
  state.bottom = bottom
  state.introLength = Math.max(0, total - (bottom - railStartY))
  state.droplets = createDroplets(elements, railX, scopeRect.top)
  elements.line.style.strokeDasharray = `${total} ${total}`
}

/** Pinta el estado: solo cambia stroke-dashoffset y, si hace falta, el atributo de cada gotita. */
const render = (line: SVGPathElement, state: ThreadState): void => {
  const drawn = drawnLengthAt({
    tipY: state.tipY,
    introLength: state.introLength,
    introProgress: state.introProgress,
    railStartY: state.railStartY,
  })
  line.style.strokeDashoffset = String(Math.max(0, state.total - drawn))

  for (const droplet of state.droplets) {
    const shouldShow = state.introProgress >= 1 && state.tipY >= droplet.y
    if (shouldShow === droplet.isShown) continue
    droplet.isShown = shouldShow
    droplet.node.toggleAttribute('data-shown', shouldShow)
  }
}

const tipYAtTop = (scope: HTMLElement): number => {
  const scopeTopInPage = scope.getBoundingClientRect().top + window.scrollY
  return window.innerHeight * TIP_VIEWPORT_RATIO - scopeTopInPage
}

const createScrollDrawing = ({ gsap }: MotionRuntime, elements: ThreadElements, state: ThreadState): void => {
  gsap.fromTo(
    state,
    { tipY: () => tipYAtTop(elements.scope) },
    {
      tipY: () => state.bottom,
      ease: 'none',
      onUpdate: () => render(elements.line, state),
      scrollTrigger: {
        trigger: elements.scope,
        start: 'top top',
        end: 'bottom bottom',
        scrub: THREAD_SCRUB_SECONDS,
        invalidateOnRefresh: true,
      },
    },
  )
}

/** Una sola secuencia: la gota nueva crece en la punta de la del logo, cae y arranca el hilo; aparece el slogan. */
const createLoadSequence = ({ gsap }: MotionRuntime, elements: ThreadElements, state: ThreadState): void => {
  const drop = elements.scope.querySelector('[data-hero-drop]')
  const slogan = elements.scope.querySelector('[data-hero-slogan]')
  const fallDistance = Number(drop?.getAttribute('data-fall-distance') ?? 0)
  const { dropGrow, dropFall, dropFade, threadIntro, sloganDelay, sloganReveal, sloganOffsetPx } = LOAD_SEQUENCE
  const timeline = gsap.timeline({ defaults: { ease: EASE_OUT } })

  if (drop !== null) {
    timeline
      .fromTo(drop, { scale: 0, opacity: 1, transformOrigin: '50% 0%' }, { scale: 1, duration: dropGrow })
      .to(drop, { y: fallDistance, scaleY: 1.12, duration: dropFall, ease: EASE_FALL })
      .addLabel('landed')
      .to(drop, { opacity: 0, duration: dropFade }, 'landed')
  }
  timeline.to(
    state,
    { introProgress: 1, duration: threadIntro, onUpdate: () => render(elements.line, state) },
    drop === null ? 0 : 'landed',
  )
  if (slogan !== null) {
    timeline.fromTo(slogan, { opacity: 0, y: sloganOffsetPx }, { opacity: 1, y: 0, duration: sloganReveal }, sloganDelay)
  }
}

const showStatic = (elements: ThreadElements, state: ThreadState): void => {
  state.introProgress = 1
  state.tipY = Number.POSITIVE_INFINITY
  render(elements.line, state)
}

const refreshWhenPageSettles = ({ ScrollTrigger }: MotionRuntime, scope: HTMLElement): (() => void) => {
  let frame = 0
  const scheduleRefresh = (): void => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => ScrollTrigger.refresh())
  }
  const observer = new ResizeObserver(scheduleRefresh)
  observer.observe(scope)
  void document.fonts.ready.then(scheduleRefresh)
  window.addEventListener('load', scheduleRefresh)

  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    window.removeEventListener('load', scheduleRefresh)
  }
}

/** Arma el hilo con las librerías ya cargadas. Devuelve cómo deshacerlo todo. */
const startThread = (runtime: MotionRuntime, scope: HTMLElement): (() => void) => {
  const { gsap, ScrollTrigger } = runtime
  const elements = findElements(scope)
  if (elements === null) return () => undefined

  const state: ThreadState = {
    total: 0,
    introLength: 0,
    railStartY: 0,
    bottom: 0,
    introProgress: 0,
    tipY: 0,
    droplets: [],
  }
  const mm = gsap.matchMedia()

  mm.add(
    { animate: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' },
    (context) => {
      const isReduced = context.conditions?.['reduce'] === true
      const remeasure = (): void => {
        measure(elements, state)
        render(elements.line, state)
      }
      measure(elements, state)

      if (isReduced) {
        showStatic(elements, state)
      } else {
        createScrollDrawing(runtime, elements, state)
        createLoadSequence(runtime, elements, state)
      }

      ScrollTrigger.addEventListener('refreshInit', remeasure)
      return () => ScrollTrigger.removeEventListener('refreshInit', remeasure)
    },
  )

  const stopWatching = refreshWhenPageSettles(runtime, elements.scope)
  return () => {
    stopWatching()
    mm.revert()
  }
}

/** Si las librerías no llegan, el slogan se muestra igual (empieza invisible para poder animarlo). */
const revealSloganWithoutMotion = (scope: HTMLElement): void => {
  scope.querySelector<HTMLElement>('[data-hero-slogan]')?.style.setProperty('opacity', '1')
}

/**
 * Hilo de miel: un trazo dorado que nace en la gota del logo y baja por el margen izquierdo
 * a medida que se hace scroll, con una gotita en cada elemento marcado con data-honey-drop.
 * Con movimiento reducido queda dibujado completo desde el inicio. GSAP se descarga aparte.
 */
export const useHoneyThread = (scopeRef: RefObject<HTMLElement | null>): void => {
  useEffect(() => {
    const scope = scopeRef.current
    if (scope === null) return undefined

    let stop: (() => void) | null = null
    let isCancelled = false
    loadMotion().then(
      (runtime) => {
        if (!isCancelled) stop = startThread(runtime, scope)
      },
      () => revealSloganWithoutMotion(scope),
    )

    return () => {
      isCancelled = true
      stop?.()
    }
  }, [scopeRef])
}
