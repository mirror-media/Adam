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
      shouldTranslate && `transform: translate(0, -${rwd.mobile.height})`
  }
  ${({ theme }) => theme.breakpoint.md} {
    ${
      /** @param {{rwd: Rwd, shouldTranslate: boolean}} props*/
      ({ shouldTranslate, rwd }) =>
        shouldTranslate && `transform: translate(0, -${rwd.tablet.height})`
    }
  }

  ${({ theme }) => theme.breakpoint.xl} {
    ${
      /** @param {{rwd: Rwd, shouldTranslate: boolean}} props*/
      ({ shouldTranslate, rwd }) =>
        shouldTranslate && `transform: translate(0, -${rwd.tablet.height})`
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
  return (
    <Container rwd={rwd} shouldTranslate={shouldTranslate}>
      {children}
    </Container>
  )
}
