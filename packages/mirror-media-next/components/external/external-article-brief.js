import styled from 'styled-components'

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.color.brandColor.darkBlue};
  padding: 16px 24px;
  font-size: 18px;
  line-height: 36px;

  img {
    width: 100%;
  }

  ${({ theme }) => theme.breakpoint.md} {
    font-weight: 400;
    font-size: 19.2px;
    padding: 24px 32px;
  }
  *,
  *::before,
  *::after {
    color: white;
  }
`

/**
 *
 * @param {Object} props
 * @param {string} props.brief
 * @returns {JSX.Element}
 */
export default function ExternalArticleBrief({ brief = '' }) {
  return (
    <Wrapper>
      <div dangerouslySetInnerHTML={{ __html: brief }}></div>
    </Wrapper>
  )
}
