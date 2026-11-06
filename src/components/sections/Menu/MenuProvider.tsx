import { useMemo } from 'react'
import type { FC, ReactNode } from 'react'
import { useMenuState } from '../../../hooks/useMenuState'
import { MenuContext } from './menu-context'
import type { MenuContextValue } from './menu-context'

type MenuProviderProps = {
  children: ReactNode
}

export const MenuProvider: FC<MenuProviderProps> = ({ children }) => {
  const { state, actions, meta } = useMenuState()
  const value = useMemo<MenuContextValue>(() => ({ state, actions, meta }), [state, actions, meta])
  return <MenuContext value={value}>{children}</MenuContext>
}
