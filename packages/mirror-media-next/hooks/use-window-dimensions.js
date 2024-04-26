import { useState, useEffect } from 'react'

/**
 * @typedef {Object} WindowDimension
 * @property {number | undefined} width
 * @property {number | undefined} height
 */

/** @type {WindowDimension} */
const initialWindowDimension = {
  width: undefined,
  height: undefined,
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}

export default function useWindowDimensions() {
  // Initialize state with undefined width/height so server and client renders match
  const [windowDimensions, setWindowDimensions] = useState(
    initialWindowDimension
  )

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)

    // Call handler right away so state gets updated with initial window size
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}
