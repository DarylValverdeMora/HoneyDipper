import { useState } from 'react'

const REVIEW_PARAM = 'review'

/** true con ?review=1 en la URL: muestra marcas internas (platos por confirmar). Sin el parámetro, todo se ve normal. */
export const useReviewMode = (): boolean => {
  const [isReviewMode] = useState(() => new URLSearchParams(window.location.search).get(REVIEW_PARAM) === '1')
  return isReviewMode
}
