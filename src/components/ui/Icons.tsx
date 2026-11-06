import type { FC, SVGProps } from 'react'
import { cn } from '../../lib/cn'

type IconProps = SVGProps<SVGSVGElement>

const BaseIcon: FC<IconProps> = ({ className, children, ...props }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn('size-6 shrink-0', className)}
      {...props}
    >
      {children}
    </svg>
  )
}

export const MenuIcon: FC<IconProps> = (props) => {
  return (
    <BaseIcon {...props}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </BaseIcon>
  )
}

export const CloseIcon: FC<IconProps> = (props) => {
  return (
    <BaseIcon {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </BaseIcon>
  )
}

/** Burbuja de conversación genérica (no es el logo de WhatsApp). */
export const ChatIcon: FC<IconProps> = (props) => {
  return (
    <BaseIcon {...props}>
      <path d="M20 11.5a7.5 7.5 0 0 1-11.2 6.5L4 19.5l1.5-4.6A7.5 7.5 0 1 1 20 11.5Z" />
      <path d="M9 11.5h.01M12.5 11.5h.01M16 11.5h.01" strokeWidth={2.5} />
    </BaseIcon>
  )
}
