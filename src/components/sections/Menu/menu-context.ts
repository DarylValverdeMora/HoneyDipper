import { createContext, useContext } from 'react'
import type { MenuActions, MenuMeta, MenuState } from '../../../hooks/useMenuState'

export type MenuContextValue = {
  state: MenuState
  actions: MenuActions
  meta: MenuMeta
}

export const MenuContext = createContext<MenuContextValue | null>(null)

export const useMenu = (): MenuContextValue => {
  const context = useContext(MenuContext)
  if (context === null) throw new Error('Menu.* debe ir dentro de <Menu.Provider>.')
  return context
}
