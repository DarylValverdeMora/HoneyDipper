import 'react'

/** Variables CSS que los componentes pasan por style. Declararlas evita castear el objeto. */
declare module 'react' {
  interface CSSProperties {
    '--logo-mask'?: string
  }
}
