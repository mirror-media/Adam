import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

/**
 *
 * @param {Object} props
 * @param {boolean} props.isMobile - If it is on mobile, render through portal.
 * @param {string} props.selector - The class name or ID to put the component.
 * @param {React.ReactNode} props.children - The children to render
 * @returns {React.ReactNode}
 */
export default function ResponsivePortal({ isMobile, selector, children }) {
  const [portalTarget, setPortalTarget] = useState(null)

  // Make sure the document is mount.
  useEffect(() => {
    const target = document.querySelector(selector)
    setPortalTarget(target)
  }, [selector])

  if (isMobile && portalTarget) {
    return ReactDOM.createPortal(children, portalTarget)
  }

  return children
}
