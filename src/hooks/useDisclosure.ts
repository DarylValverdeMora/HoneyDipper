import { useCallback, useState } from 'react'

export type Disclosure = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

/** Estado abierto/cerrado para hojas y menús. */
export const useDisclosure = (initiallyOpen = false): Disclosure => {
  const [isOpen, setIsOpen] = useState(initiallyOpen)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((current) => !current), [])
  return { isOpen, open, close, toggle }
}
