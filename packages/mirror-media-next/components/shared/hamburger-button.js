import styled from 'styled-components'

/**
 * @typedef {import('../../type/theme').Theme} Theme
 */

const Hamburger = styled.button`
  user-select: none;
  display: block;
  margin-left: 16px;
  &:focus {
    border: none;
    outline: none;
  }
  .hamburger {
    display: block;
    width: 16px;
    height: 2px;
    margin: 2px 0;
    border-radius: 12px;
    background-color: ${
      /**
       * @param {Object} param
       * @param {Theme} [param.theme]
       * @param {string} [param.color]
       */
      ({ theme, color }) =>
        theme.color.brandColor[color] ? theme.color.brandColor[color] : color
    };

    ${({ theme }) => theme.breakpoint.xl} {
      display: none;
    }
  }
`

export default function HamburgerButton({
  color = '#000000',
  handleOnClick = () => {},
}) {
  return (
    <Hamburger color={color} onClick={handleOnClick}>
      <i className="hamburger"></i>
      <i className="hamburger"></i>
      <i className="hamburger"></i>
    </Hamburger>
  )
}
