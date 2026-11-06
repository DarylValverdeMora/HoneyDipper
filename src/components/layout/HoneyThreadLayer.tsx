import { useRef } from 'react'
import type { FC, ReactNode } from 'react'
import { useHoneyThread } from '../../hooks/useHoneyThread'

type HoneyThreadLayerProps = {
  children: ReactNode
}

/** Envuelve el contenido de la página y dibuja encima el hilo de miel. No recibe clics. */
export const HoneyThreadLayer: FC<HoneyThreadLayerProps> = ({ children }) => {
  const scopeRef = useRef<HTMLDivElement>(null)
  useHoneyThread(scopeRef)

  return (
    <div ref={scopeRef} className="relative">
      {children}
      <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute inset-0 z-10 size-full overflow-visible">
        <path
          data-honey-thread-line
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-honey"
        />
        <g data-honey-droplets />
      </svg>
    </div>
  )
}
