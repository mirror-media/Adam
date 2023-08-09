import styled from 'styled-components'
import Tags from './tags'
import CopyrightWarning from './copyright-warning'
/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

/**
 * @typedef {import('./tags').Tags}Tags
 */

const Wrapper = styled.section``
const StyledTags = styled(Tags)`
  margin-top: 32px;
`
/**
 *
 * @param {Object} props
 * @param {Tags} props.tags
 * @returns {JSX.Element}
 */
export default function MoreInfoAndTag({ tags }) {
  return (
    <Wrapper>
      <CopyrightWarning />
      <StyledTags tagColor="black" tags={tags}></StyledTags>
    </Wrapper>
  )
}
