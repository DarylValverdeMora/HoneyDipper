import type { FC, ReactNode } from 'react'
import { business } from '../../../data/business'
import { Menu } from './index'
import { useMenu } from './menu-context'

type MenuSurfaceProps = {
  children: ReactNode
}

/** El fondo sigue al grupo activo; solo cambia el color, con transición. */
const MenuSurface: FC<MenuSurfaceProps> = ({ children }) => {
  const { state } = useMenu()
  return (
    <section
      id="menu"
      aria-labelledby="menu-titulo"
      data-menu-surface={state.activeGroup.id}
      className="bg-menu-surface text-foreground transition-[background-color] duration-300 ease-out"
    >
      {children}
    </section>
  )
}

/** Sección Menú: pestañas de grupo y chips fijos arriba, y la lista de platos del grupo activo. */
export const MenuSection: FC = () => {
  return (
    <Menu.Provider>
      <MenuSurface>
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <div className="pt-16 pb-6">
            <h2 id="menu-titulo" className="text-5xl">
              Menú
            </h2>
            <p className="mt-3 text-sm text-foreground">Precios en colones. {business.serviceChargeNote}.</p>
          </div>
          <div className="sticky top-header z-20 -mx-4 flex h-menu-nav flex-col justify-end bg-menu-surface px-4 shadow-menu-bar transition-[background-color] duration-300 ease-out md:-mx-6 md:px-6">
            <Menu.Tabs />
            <Menu.Chips />
          </div>
          <Menu.Panel />
        </div>
      </MenuSurface>
    </Menu.Provider>
  )
}
