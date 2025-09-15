import styled, { css } from 'styled-components'

/**
 * @typedef {string} Width
 * @typedef {string} Height
 * @typedef {string} Margin
 *
 * @typedef {Object} Rwd
 * @property {{width: Width, height: Height, margin: Margin}} mobile
 * @property {{width: Width, height: Height, margin: Margin}} tablet
 * @property {{width: Width, height: Height, margin: Margin}} desktop
 */

// Note: 'mobile+tablet' and 'desktop' were kept for compatibility with
// commonly used setups and the original pre-refactor configuration.
// 'mobile' and 'tablet' currently unused, reserved for potential future use
/** @typedef {'all' | 'mobile' | 'tablet' | 'mobile+tablet' | 'desktop'} DisplayAt */

/**
 * @typedef {Object} PlaceholderStyleProps
 * @property {Rwd} $rwd
 * @property {DisplayAt} $displayAt
 * @property {boolean} $visible
 */

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
 * Build display CSS by displayAt.
 * @param {PlaceholderStyleProps & { theme: import('../../../styles/theme/media').Theme }} styleProps
 */
const displayByBreakpoint = (styleProps) => {
  const { $displayAt, $visible, theme } = styleProps
  if (!$visible) {
    return css`
      display: none;
    `
  }

  switch ($displayAt) {
    case 'mobile': // currently unused, reserved for future use
      return css`
        display: block;
        ${theme.breakpoint.md} {
          display: none;
        }
        ${theme.breakpoint.xl} {
          display: none;
        }
      `
    case 'tablet': // currently unused, reserved for future use
      return css`
        display: none;
        ${theme.breakpoint.md} {
          display: block;
        }
        ${theme.breakpoint.xl} {
          display: none;
        }
      `
    case 'mobile+tablet': // common usage & legacy settings
      return css`
        display: block;
        ${theme.breakpoint.xl} {
          display: none;
        }
      `
    case 'desktop': // common usage & legacy settings
      return css`
        display: none;
        ${theme.breakpoint.xl} {
          display: block;
        }
      `
    default: // covers 'all' and unexpected values
      return css`
        display: block;
      `
  }
}

/** @type {import('styled-components').StyledComponent<'div', any, PlaceholderStyleProps>} */
const Container = styled.div(
  /**
   * @param {PlaceholderStyleProps & { theme: import('../../../styles/theme/media').Theme }} styleProps
   */
  (styleProps) => css`
    position: relative;
    min-width: ${styleProps.$rwd.mobile.width};
    min-height: ${styleProps.$rwd.mobile.height};
    margin: ${styleProps.$rwd.mobile.margin};

    ${styleProps.theme.breakpoint.md} {
      min-width: ${styleProps.$rwd.tablet.width};
      min-height: ${styleProps.$rwd.tablet.height};
      margin: ${styleProps.$rwd.tablet.margin};
    }

    ${styleProps.theme.breakpoint.xl} {
      min-width: ${styleProps.$rwd.desktop.width};
      min-height: ${styleProps.$rwd.desktop.height};
      margin: ${styleProps.$rwd.desktop.margin};
    }

    ${displayByBreakpoint(styleProps)}
  `
)

/** @type {import('styled-components').StyledComponent<'div', any, { $visible: boolean }>} */
const ContainerAside = styled.div(
  /**
   * @param {{ $visible: boolean, theme: import('../../../styles/theme/media').Theme }} styleProps
   */
  (styleProps) => css`
    display: none;
    position: relative;
    ${styleProps.theme.breakpoint.xl} {
      min-height: 600px;
      display: ${styleProps.$visible ? 'block' : 'none'};
    }
  `
)

/**
 * @param {Object} props
 * @param {Rwd} [props.rwd]
 * @param {import('react').JSX.Element} props.children
 * @param {DisplayAt} [props.displayAt='all']
 * @param {boolean} [props.shouldShowAd=true]
 * @param {boolean} [props.isLogInProcessFinished=false]
 * @returns {import('react').JSX.Element}
 */
function GPT_Placeholder({
  rwd = DEFAULT_SIZES,
  children,
  displayAt = 'all',
  shouldShowAd = true,
  isLogInProcessFinished = false,
}) {
  const isSlotVisible = shouldShowAd || !isLogInProcessFinished
  return (
    // Using $ as a prefix makes this prop transient (available since styled-components v5.1)
    // $rwd will be used in styled-components but not passed to DOM
    // https://styled-components.com/docs/api#transient-props
    <Container $rwd={rwd} $displayAt={displayAt} $visible={isSlotVisible}>
      {children}
    </Container>
  )
}

/**
 * Aside Placeholder
 * @param {Object} props
 * @param {import('react').JSX.Element} props.children
 * @param {boolean} [props.shouldShowAd=true]
 * @param {boolean} [props.isLogInProcessFinished=false]
 * @returns {import('react').JSX.Element}
 */
function GPT_Placeholder_Aside({
  children,
  shouldShowAd = true,
  isLogInProcessFinished = false,
}) {
  const isSlotVisible = shouldShowAd || !isLogInProcessFinished
  return <ContainerAside $visible={isSlotVisible}>{children}</ContainerAside>
}

export { GPT_Placeholder, GPT_Placeholder_Aside }
