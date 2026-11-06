import type { FC } from 'react'
import { BaseCheck } from './components/sections/BaseCheck'

/** Etapa 2B: solo confirma que tokens, fuentes y datos cargan. Las secciones llegan en la 2C. */
export const App: FC = () => {
  return (
    <main className="min-h-dvh bg-surface-brand text-on-brand">
      <BaseCheck />
    </main>
  )
}
