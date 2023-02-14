import styled from 'styled-components'

const StyledMockAdvertisement = styled.div`
  width: ${
    /**
     *
     * @param {Object} props
     * @param {String} props.width
     * @param {String} props.height
     * @param {String} props.backgroundColor
     */
    (props) => props.width
  };
  height: ${(props) => props.height};
  background-color: ${(props) => props.backgroundColor};
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  p {
    text-align: center;
  }
`

/**
 * Mock element for advertisement, accept params to adjust sizes, color, and showing text
 * @param {Object} props
 * @param {String} [props.width] - Width of advertisement. Optional, default value is "100%"
 * @param {String} [props.height] - Height of advertisement. Optional, default value is "100%"
 * @param {String} [props.backgroundColor] - Background color of advertisement. Optional, default value is "#FFA011"
 * @param {String} [props.text] - text of advertisement. Optional, default value is "This is an advertisement with width `${props.width}` and height `${props.height}`."
 * @param {String} [props.className] - attribute for updating style by styled-component
 * @returns {JSX.Element}
 */
export default function MockAdvertisement({
  width = '100%',
  height = '100%',
  backgroundColor = '#ffa011',
  text = '',
  className,
}) {
  return (
    <StyledMockAdvertisement
      width={width}
      height={height}
      backgroundColor={backgroundColor}
      className={className}
    >
      <p>
        {text
          ? text
          : `This is an advertisement with width ${width} and height ${height}.`}
      </p>
    </StyledMockAdvertisement>
  )
}
