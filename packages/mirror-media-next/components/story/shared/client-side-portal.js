import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

/**
 *
 * reference: https://react.dev/reference/react-dom/createPortal
 *
 * @param {Object} props
 * @param {boolean} props.isTransport - If it is on mobile, render through portal.
 * @param {string} props.selector - The class name or ID to put the component.
 * @param {React.ReactNode} props.children - The children to render
 * @returns {React.ReactNode}
 */
export default function ResponsivePortal({ isTransport, selector, children }) {
  const [portalTarget, setPortalTarget] = useState(null)

  useEffect(() => {
    const target = document.querySelector(selector)
    setPortalTarget(target)
  }, [selector])

  if (isTransport && portalTarget) {
    return ReactDOM.createPortal(children, portalTarget)
  }

  return children
}
