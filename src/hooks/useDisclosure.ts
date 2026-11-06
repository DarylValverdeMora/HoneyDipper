import { useCallback, useState } from 'react'

export type Disclosure = {
  isOpen: boolean
  open: () => void
  close: () => void
}

/** Estado abierto/cerrado para hojas y menús. */
export const useDisclosure = (initiallyOpen = false): Disclosure => {
  const [isOpen, setIsOpen] = useState(initiallyOpen)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  return { isOpen, open, close }
}
