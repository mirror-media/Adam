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
  position: relative;
  min-width: ${
    /**
     *
     * @param {Object} props
     * @param {Rwd} props.rwd
     * @param {boolean} [props.shouldTranslate]
     */
    ({ rwd }) => rwd.mobile.width
  };
  min-height: ${({ rwd, shouldTranslate }) =>
    shouldTranslate ? '0px' : rwd.mobile.height};
  margin: ${({ rwd }) => rwd.mobile.margin};

  ${({ theme }) => theme.breakpoint.md} {
    min-width: ${({ rwd }) => rwd.tablet.width};
    min-height: ${({ rwd, shouldTranslate }) =>
      shouldTranslate ? '0px' : rwd.tablet.height};
    margin: ${({ rwd }) => rwd.tablet.margin};
  }

  ${({ theme }) => theme.breakpoint.xl} {
    min-width: ${({ rwd }) => rwd.desktop.width};
    min-height: ${({ rwd, shouldTranslate }) =>
      shouldTranslate ? '0px' : rwd.desktop.height};
    margin: ${({ rwd }) => rwd.desktop.margin};
  }
`
const ContainerMobileAndTablet = styled(Container)`
  display: block;
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`
const ContainerDesktop = styled(Container)`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
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
 * @param {JSX.Element} props.children
 * @param {boolean} [props.shouldTranslate]
 * @returns {JSX.Element}
 */
export default function GPT_Placeholder({
  rwd = DEFAULT_SIZES,
  children,
  shouldTranslate = false,
}) {
  return (
    <Container rwd={rwd} shouldTranslate={shouldTranslate}>
      {children}
    </Container>
  )
}
/**
 *
 * @param {Object} props
 * @param {Rwd} [props.rwd]
 * @param {JSX.Element} props.children
 * @returns
 */
const GPT_Placeholder_MobileAndTablet = ({ rwd = DEFAULT_SIZES, children }) => {
  return (
    <ContainerMobileAndTablet rwd={rwd}>{children}</ContainerMobileAndTablet>
  )
}
const GPT_Placeholder_Desktop = ({ rwd = DEFAULT_SIZES, children }) => {
  return <ContainerDesktop rwd={rwd}>{children}</ContainerDesktop>
}

export { GPT_Placeholder_MobileAndTablet, GPT_Placeholder_Desktop }
