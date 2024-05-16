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
    shouldTranslate ? rwd.mobile.height : '0px'};
  margin: ${({ rwd }) => rwd.mobile.margin};

  ${({ theme }) => theme.breakpoint.md} {
    min-width: ${({ rwd }) => rwd.tablet.width};
    min-height: ${({ rwd, shouldTranslate }) =>
      shouldTranslate ? rwd.tablet.height : '0px'};
    margin: ${({ rwd }) => rwd.tablet.margin};
  }

  ${({ theme }) => theme.breakpoint.xl} {
    min-width: ${({ rwd }) => rwd.desktop.width};
    min-height: ${({ rwd, shouldTranslate }) => {
      return shouldTranslate ? rwd.desktop.height : '0px'
    }};
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

const ContainerAside = styled.div`
  position: relative;
  ${({ theme }) => theme.breakpoint.xl} {
    min-height: ${
      /**
       *
       * @param {Object} props
       * @param {boolean} [props.shouldTranslate]
       */
      ({ shouldTranslate }) => (shouldTranslate ? '300px' : '0px')
    };
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
 * @param {boolean} [props.shouldShowAd]
 * @param {boolean} [props.isHDAdEmpty]
 * @param {boolean} [props.isLogInProcessFinished]
 * @returns {JSX.Element}
 */
export default function GPT_Placeholder({
  rwd = DEFAULT_SIZES,
  children,
  // 為了 cls 先暫時移除
  isHDAdEmpty = false,
  shouldShowAd = true,
  isLogInProcessFinished = false,
}) {
  return (
    <Container
      rwd={rwd}
      shouldTranslate={shouldShowAd || !isLogInProcessFinished}
    >
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

/**
 *
 * @param {Object} props
 * @param {JSX.Element} props.children
 * @param {boolean} [props.shouldShowAd]
 * @param {boolean} [props.isLogInProcessFinished]
 * @returns
 */
const GPT_Placeholder_Aside = ({
  children,
  shouldShowAd = true,
  isLogInProcessFinished = false,
}) => {
  return (
    <ContainerAside shouldTranslate={shouldShowAd || !isLogInProcessFinished}>
      {children}
    </ContainerAside>
  )
}

export {
  GPT_Placeholder_MobileAndTablet,
  GPT_Placeholder_Desktop,
  GPT_Placeholder_Aside,
}
