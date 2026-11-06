import type { AnchorHTMLAttributes, ButtonHTMLAttributes, FC } from 'react'
import { tv } from 'tailwind-variants'
import type { VariantProps } from 'tailwind-variants'

/**
 * Botones de la marca. principal = Verde pino ("Reservar mesa"),
 * secundario = Amarillo mantequilla ("Cotiza tu pastel"), discreto = sin fondo.
 * Sin flechas ni íconos decorativos: el texto basta.
 */
export const buttonStyles = tv({
  base: [
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-body font-medium select-none',
    'transition-[scale,background-color] duration-150 ease-out',
    'active:not-disabled:scale-96 disabled:pointer-events-none disabled:opacity-50',
  ],
  variants: {
    intent: {
      principal: 'bg-cta text-on-cta shadow-raised hover:bg-cta/90',
      secundario: 'bg-cta-alt text-on-cta-alt shadow-raised hover:bg-cta-alt/85',
      discreto: 'bg-transparent text-foreground hover:bg-foreground/5',
    },
    size: {
      sm: 'px-4 text-sm',
      md: 'px-6 text-base',
    },
    full: {
      true: 'w-full',
    },
  },
  defaultVariants: {
    intent: 'principal',
    size: 'md',
  },
})

export type ButtonVariants = VariantProps<typeof buttonStyles>

type ButtonProps = ButtonVariants & ButtonHTMLAttributes<HTMLButtonElement>

export const Button: FC<ButtonProps> = ({ intent, size, full, className, type = 'button', ...props }) => {
  return <button type={type} className={buttonStyles({ intent, size, full, class: className })} {...props} />
}

type ButtonLinkProps = ButtonVariants &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    /** Abre en otra pestaña (WhatsApp, Maps, Instagram). */
    external?: boolean
  }

export const ButtonLink: FC<ButtonLinkProps> = ({ intent, size, full, className, external = false, ...props }) => {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return <a className={buttonStyles({ intent, size, full, class: className })} {...externalProps} {...props} />
}
