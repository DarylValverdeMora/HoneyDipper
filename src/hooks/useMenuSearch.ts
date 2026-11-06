import { useCallback, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { MenuGroup } from '../data/menu.types'
import { buildSearchIndex, searchMenu } from '../lib/search'
import type { SearchEntry } from '../lib/search'
import { useDebouncedValue } from './useDebouncedValue'

/** Retraso corto: busca cuando la persona hace una pausa al escribir. */
const SEARCH_DELAY_MS = 150

type MenuSearch = {
  query: string
  /** La búsqueda que ya se aplicó (con retraso). */
  appliedQuery: string
  results: readonly SearchEntry[]
  onQueryChange: (event: ChangeEvent<HTMLInputElement>) => void
  clear: () => void
}

/** Estado de la búsqueda. Vive en el componente de búsqueda, así escribir no vuelve a pintar el menú. */
export const useMenuSearch = (groups: readonly MenuGroup[]): MenuSearch => {
  const [query, setQuery] = useState('')
  const appliedQuery = useDebouncedValue(query, SEARCH_DELAY_MS)
  const index = useMemo(() => buildSearchIndex(groups), [groups])
  const results = useMemo(() => searchMenu(index, appliedQuery), [index, appliedQuery])

  const onQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }, [])
  const clear = useCallback(() => setQuery(''), [])

  return { query, appliedQuery, results, onQueryChange, clear }
}
