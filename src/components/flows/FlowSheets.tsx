import type { FC } from 'react'
import { CakeSheet } from './CakeSheet'
import { EventSheet } from './EventSheet'
import { ReservationSheet } from './ReservationSheet'

/** Las tres hojas de WhatsApp. Solo una está abierta a la vez (WhatsAppFlowProvider). */
export const FlowSheets: FC = () => {
  return (
    <>
      <ReservationSheet />
      <CakeSheet />
      <EventSheet />
    </>
  )
}
