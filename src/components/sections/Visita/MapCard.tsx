import type { FC } from 'react'
import { business } from '../../../data/business'
import { useDeferredMap } from '../../../hooks/useDeferredMap'
import type { MapState } from '../../../hooks/useDeferredMap'
import { buildMapEmbedUrl } from '../../../lib/maps'
import { assertNever } from '../../../lib/types'
import { Button } from '../../ui/Button'
import { PinIcon } from '../../ui/Icons'
import { Panal } from '../../ui/Panal'

const MAP_EMBED_URL = buildMapEmbedUrl(business.location.coordinates)

const describeMapState = (state: MapState): string => {
  switch (state.kind) {
    case 'estatico':
    case 'listo':
      return ''
    case 'cargando':
      return 'Cargando el mapa…'
    case 'error':
      return state.reason === 'sin-conexion'
        ? 'Sin conexión no se puede cargar el mapa. Usa "Abrir en Google Maps" cuando vuelvas a tener señal.'
        : 'El mapa no cargó. Puedes intentar de nuevo o abrirlo en Google Maps.'
    default:
      return assertNever(state)
  }
}

type StaticMapProps = {
  state: MapState
  onLoad: () => void
}

/**
 * Imagen fija mientras no se pide el mapa: textura de panal, el pin y la dirección.
 * Es una ilustración, no un mapa real (sin clave de API no hay imagen estática de Google).
 */
const StaticMap: FC<StaticMapProps> = ({ state, onLoad }) => {
  const message = describeMapState(state)

  return (
    <div className="relative isolate flex size-full flex-col items-center justify-center gap-4 p-6 text-center">
      <Panal className="opacity-30" />
      <PinIcon className="size-12 text-foreground" />
      <p className="max-w-xs font-display text-2xl leading-tight">{business.location.address}</p>
      <p role="status" className="min-h-5 max-w-xs text-sm text-pretty">
        {message}
      </p>
      {state.kind !== 'cargando' && (
        <Button intent="principal" onClick={onLoad}>
          {state.kind === 'error' ? 'Intentar de nuevo' : 'Ver mapa'}
        </Button>
      )}
    </div>
  )
}

/**
 * Mapa diferido: el iframe solo existe después de tocar "Ver mapa".
 * Un iframe bloqueado por el navegador igual dispara load (y no se puede leer por ser de otro dominio),
 * así que debajo queda siempre el enlace directo a Google Maps.
 */
export const MapCard: FC = () => {
  const { state, load, handleLoad } = useDeferredMap()
  const showIframe = state.kind === 'cargando' || state.kind === 'listo'

  return (
    <div className="flex flex-col gap-3">
      <div
        data-map-state={state.kind}
        className="relative aspect-square w-full overflow-hidden rounded-3xl bg-surface-soft text-foreground outline -outline-offset-1 outline-image-outline sm:aspect-4/3"
      >
        <StaticMap state={state} onLoad={load} />
        {showIframe && (
          <iframe
            title={`Mapa de Google: ${business.name}, ${business.location.address}`}
            src={MAP_EMBED_URL}
            onLoad={handleLoad}
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 size-full border-0 opacity-0 transition-[opacity] duration-300 ease-out data-ready:opacity-100"
            data-ready={state.kind === 'listo' ? '' : undefined}
          />
        )}
      </div>
      {showIframe && (
        <p className="text-sm">
          Si el mapa no aparece,{' '}
          <a
            href={business.location.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
          >
            ábrelo en Google Maps
          </a>
          .
        </p>
      )}
    </div>
  )
}
