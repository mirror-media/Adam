import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

/**
 * @typedef {string} Width
 * @typedef {string} Height
 * @typedef {string} Margin
 *
 *
 * @typedef {Object} Rwd
 * @property {{width: Width, height: Height, margin: Margin}} rwd.mobile
 * @property {{width: Width, height: Height, margin: Margin}} rwd.tablet
 * @property {{width: Width, height: Height, margin: Margin}} rwd.desktop
 */

const Container = styled.div`
  ${
    /** @param {{rwd: Rwd, shouldTranslate: boolean}} props*/
    ({ shouldTranslate, rwd }) =>
      shouldTranslate &&
      `
      transform: translate(0, -${rwd.mobile.height});
      `
  }
  ${({ theme }) => theme.breakpoint.md} {
    ${
      /** @param {{rwd: Rwd, shouldTranslate: boolean}} props*/
      ({ shouldTranslate, rwd }) =>
        shouldTranslate &&
        `
        transform: translate(0, -${rwd.tablet.height});
        `
    }
  }

  ${({ theme }) => theme.breakpoint.xl} {
    ${
      /** @param {{rwd: Rwd, shouldTranslate: boolean}} props*/
      ({ shouldTranslate, rwd }) =>
        shouldTranslate &&
        `
        transform: translate(0, -${rwd.tablet.height});
        `
    }
  }
`

const DEFAULT_SIZES = {
  mobile: {
    width: '300px',
    height: '250px',
    margin: '20px auto 0px',
  },
  tablet: {
    width: '300px',
    height: '250px',
    margin: '20px auto 0px',
  },
  desktop: {
    width: '970px',
    height: '250px',
    margin: '20px auto 0px',
  },
}

/**
 *
 * @param {Object} props
 * @param {Rwd} [props.rwd]
 * @param {boolean} [props.shouldTranslate]
 * @param {JSX.Element} props.children
 * @returns {JSX.Element}
 */
export default function GPT_TranslateContainer({
  rwd = DEFAULT_SIZES,
  children,
  shouldTranslate,
}) {
  const containerRef = useRef(null)
  // const [originalHeight, setOriginalHeight] = useState(0)

  // useEffect(() => {
  //   const containerHeight = containerRef.current.clientHeight
  //   setOriginalHeight(containerHeight)
  // }, [setOriginalHeight])

  // useEffect(() => {
  //   if (shouldTranslate && containerRef.current) {
  //     const translationHeight = parseInt(rwd.mobile.height, 10)
  //     containerRef.current.style.height = `${
  //       originalHeight - translationHeight
  //     }px`
  //   } else {
  //     containerRef.current.style.height = `fit-content`
  //   }
  // }, [shouldTranslate, rwd.mobile.height, originalHeight])
  return (
    <Container rwd={rwd} shouldTranslate={shouldTranslate} ref={containerRef}>
      {children}
    </Container>
  )
}
