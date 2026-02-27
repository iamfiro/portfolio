import { createPortal } from 'react-dom'

type PortalProps = {
  container?: HTMLElement
  children: React.ReactNode
}

function Portal({ container, children }: PortalProps) {
  return createPortal(children, container ?? document.body)
}

export { Portal }
export type { PortalProps }
