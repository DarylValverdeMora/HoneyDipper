import type { FC, ReactNode } from 'react'
import { business } from '../../../data/business'
import { honeyDrop } from '../../../lib/honey-drop'
import { Panal } from '../../ui/Panal'
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

const MenuHeader: FC = () => {
  return (
    <div className="relative isolate pt-16 pb-8 md:pt-20 md:pb-10">
      <Panal className="opacity-15" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div>
          <h2 id="menu-titulo" {...honeyDrop} className="text-5xl md:text-6xl">
            Menú
          </h2>
          <p className="mt-3 text-sm text-foreground">Precios en colones. {business.serviceChargeNote}.</p>
        </div>
        <div className="w-full lg:max-w-md">
          <Menu.Search />
        </div>
      </div>
    </div>
  )
}

/**
 * Sección Menú. En móvil y tablet, pestañas y chips quedan fijos arriba;
 * en escritorio pasan a una columna fija a la izquierda y los platos van a la derecha.
 */
export const MenuSection: FC = () => {
  return (
    <Menu.Provider>
      <MenuSurface>
        <div className="mx-auto max-w-3xl px-4 md:px-10 lg:max-w-6xl lg:px-6">
          <MenuHeader />
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="sticky top-header z-20 -mx-4 flex h-menu-nav flex-col justify-end bg-menu-surface px-4 shadow-menu-bar transition-[background-color] duration-300 ease-out md:-mx-10 md:px-10 lg:top-menu-side lg:col-span-3 lg:mx-0 lg:h-auto lg:max-h-menu-side-max lg:justify-start lg:gap-6 lg:self-start lg:overflow-y-auto lg:bg-transparent lg:px-0 lg:shadow-none">
              <Menu.Tabs />
              <Menu.Chips />
            </div>
            <div className="lg:col-span-9">
              <Menu.Panel />
            </div>
          </div>
        </div>
      </MenuSurface>
    </Menu.Provider>
  )
}
