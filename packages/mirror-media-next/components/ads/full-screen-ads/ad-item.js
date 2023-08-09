import styled, { css } from 'styled-components'
import { Z_INDEX } from '../../../constants'
import { useState } from 'react'

/**
 * @typedef {'default' | 'bottom' | 'modified'| 'unset'} FullScreenAdStyle
 */

const defaultWrapperStyle = css`
  z-index: ${Z_INDEX.top};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.7);

  .ad-item {
    position: relative;
    width: 320px;
    height: 480px;
  }
`
const bottomWrapperStyle = css`
  background-color: transparent;
  position: fixed;
  top: initial;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${Z_INDEX.top};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  .ad-item {
    position: relative;
    height: 180px;
  }
`
const modifiedWrapperStyle = css`
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: ${Z_INDEX.top};
`

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 32px;
  height: 32px;
  padding: 5px;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 2px 2px 5px #d3d3d3;
  background-color: #d3d3d3;
  &::before,
  &::after {
    position: absolute;
    content: '';
    top: calc((20px + 5px) / 2);
    left: 0;
    right: 0;
    height: 2px;
    background: white;
    border-radius: 2px;
  }
  &:before {
    transform: rotate(45deg);
  }

  &:after {
    transform: rotate(-45deg);
  }
  &:focus {
    outline: none;
  }
`

const Wrapper = styled.div`
  z-index: ${Z_INDEX.top};
  position: fixed;
  top: 0;
  display: flex;
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
  ${
    /**
     * @param {Object} param
     * @param {FullScreenAdStyle} param.fullScreenAdStyle
     */
    ({ fullScreenAdStyle }) => {
      switch (fullScreenAdStyle) {
        case 'default':
          return defaultWrapperStyle
        case 'bottom':
          return bottomWrapperStyle
        case 'modified':
          return modifiedWrapperStyle
        case 'unset':
          return null
        default:
          return null
      }
    }
  }
`
/**
 *
 * @param {Object} props
 * @param {boolean} [props.isAdFirstClosedBtnVisible]
 * @param {FullScreenAdStyle } props.fullScreenAdStyle
 * @param {JSX.Element} props.children
 * @returns {JSX.Element}
 */
export default function FullScreenAdItem({
  fullScreenAdStyle = 'unset',
  isAdFirstClosedBtnVisible = false,
  children,
}) {
  const shouldShowCloseButton =
    isAdFirstClosedBtnVisible &&
    (fullScreenAdStyle === 'default' || fullScreenAdStyle === 'bottom')
  const [isEnabled, setIsEnabled] = useState(true)
  const closeFullAd = () => {
    setIsEnabled(false)
  }
  return (
    <>
      {isEnabled && (
        <Wrapper fullScreenAdStyle={fullScreenAdStyle}>
          <div className="ad-item">
            {children}
            {shouldShowCloseButton && <CloseButton onClick={closeFullAd} />}
          </div>
        </Wrapper>
      )}
    </>
  )
}
