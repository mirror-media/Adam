import styled from 'styled-components'
/**
 * @typedef {import('../../type/theme').Theme} Theme
 */

const Close = styled.button`
  width: 36px;
  height: 36px;
  padding: 4px;
  display: flex;
  position: absolute;
  top: 0px;
  right: 0px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &:focus {
    outline: none;
  }
  .close {
    border-color: ${
      /**
       * @param {Object} param
       * @param {string} param.color
       * @param {Theme} param.theme
       */
      ({ theme, color }) =>
        theme.color.brandColor[color] ? theme.color.brandColor[color] : color
    };
    border-width: 1px;
    border-style: solid;
    border-radius: 50%;
    height: 20px;
    width: 20px;
    margin: 0 5px 0 0;
    position: relative;
    &:before,
    :after {
      position: absolute;
      left: 8.5px;
      top: 5px;
      transform: translate(-50%, -50%);
      content: ' ';
      height: 8.5px;
      width: 1.2px;
      background-color: ${
        /**
         * @param {Object} param
         * @param {string} param.color
         * @param {Theme} param.theme
         */
        ({ theme, color }) =>
          color && theme.color.brandColor[color]
            ? theme?.color?.brandColor[color]
            : color
      };
    }
    &:before {
      transform: rotate(45deg);
    }
    &:after {
      transform: rotate(-45deg);
    }
  }
`

export default function CloseButton({
  color = '#ffffff',
  handleOnClick = () => {},
}) {
  return (
    <Close color={color} onClick={handleOnClick}>
      <i className="close"></i>
    </Close>
  )
}
