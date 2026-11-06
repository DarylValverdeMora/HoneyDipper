import { memo, useCallback, useId } from 'react'
import type { FC } from 'react'
import { whatsappTemplates } from '../../../data/whatsapp'
import type { ProductTarget } from '../../../hooks/useMenuState'
import { useMenuSearch } from '../../../hooks/useMenuSearch'
import type { SearchEntry } from '../../../lib/search'
import { buildWhatsAppLink } from '../../../lib/whatsapp'
import { formatPrice } from '../../../lib/price'
import { CloseIcon } from '../../ui/Icons'
import { useMenu } from './menu-context'

const lowerFirst = (text: string): string => {
  return text.charAt(0).toLowerCase() + text.slice(1)
}

const resultsLabel = (count: number): string => {
  if (count === 1) return '1 plato encontrado'
  return `${count} platos encontrados`
}

type SearchResultProps = {
  entry: SearchEntry
  onSelect: (target: ProductTarget) => void
}

const SearchResultRow: FC<SearchResultProps> = ({ entry, onSelect }) => {
  const onClick = useCallback(() => {
    onSelect({ groupId: entry.groupId, categoryId: entry.categoryId, productName: entry.product.nombre })
  }, [entry, onSelect])

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex min-h-11 w-full items-baseline justify-between gap-4 rounded-xl px-3 py-2.5 text-left transition-[background-color,scale] duration-150 ease-out hover:bg-surface-soft active:scale-96"
      >
        <span className="flex flex-col">
          <span className="dish-name text-lg text-foreground">{entry.product.nombre}</span>
          <span className="text-xs text-foreground-accent">
            {entry.groupLabel}, {entry.categoryName}
          </span>
        </span>
        <span className="price shrink-0 text-sm text-foreground-accent">{formatPrice(entry.product.precio)}</span>
      </button>
    </li>
  )
}

const SearchResult = memo(SearchResultRow)

type NoResultsProps = {
  query: string
}

const NoResults: FC<NoResultsProps> = ({ query }) => {
  return (
    <p className="px-3 py-2 text-sm text-foreground">
      No encontramos ese plato. Prueba con otra palabra o{' '}
      <a
        href={buildWhatsAppLink({ flow: 'consulta', values: { plato: query } })}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground"
      >
        {lowerFirst(whatsappTemplates.consulta.ctaLabel)}
      </a>
    </p>
  )
}

/** Buscador de todo el menú. Su estado es local: escribir no vuelve a pintar la lista de platos. */
export const MenuSearch: FC = () => {
  const inputId = useId()
  const { state, actions } = useMenu()
  const { query, appliedQuery, results, onQueryChange, clear } = useMenuSearch(state.groups)
  // Al borrar, los resultados se ocultan en el acto (sin esperar el retraso), así no mueven la página después.
  const hasQuery = query.trim() !== '' && appliedQuery.trim() !== ''

  const onSelect = useCallback(
    (target: ProductTarget) => {
      actions.goToProduct(target)
      clear()
    },
    [actions, clear],
  )

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        Buscar en el menú
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={onQueryChange}
          placeholder="Por ejemplo: birria, café, waffle"
          autoComplete="off"
          className="h-12 w-full appearance-none rounded-full bg-surface pr-12 pl-5 text-base text-foreground shadow-raised placeholder:text-foreground-accent focus-visible:outline-offset-2"
        />
        {query !== '' && (
          <button
            type="button"
            onClick={clear}
            aria-label="Borrar búsqueda"
            className="absolute top-1/2 right-0.5 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-foreground transition-[background-color,scale] duration-150 ease-out hover:bg-foreground/5 active:scale-96"
          >
            <CloseIcon className="size-5" />
          </button>
        )}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {hasQuery ? resultsLabel(results.length) : ''}
      </p>
      {hasQuery && (
        <div className="rounded-2xl bg-surface p-2 shadow-raised">
          {results.length === 0 ? (
            <NoResults query={appliedQuery.trim()} />
          ) : (
            <>
              <p aria-hidden="true" className="px-3 pt-1 pb-2 text-xs text-foreground-accent">
                {resultsLabel(results.length)}
              </p>
              <ul className="max-h-96 overflow-y-auto overscroll-contain" data-lenis-prevent>
                {results.map((entry) => {
                  return <SearchResult key={entry.key} entry={entry} onSelect={onSelect} />
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
