import styled from 'styled-components'
import DraftRenderBlock from '../shared/draft-renderer-block'

/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

/**
 * @typedef {import('../../../type/draft-js').Draft} Brief
 */

const BriefContainer = styled.div`
  background-color: ${
    /**
     * @param {Object} props
     * @param {String} props.sectionSlug
     * @param {Theme} [props.theme]
     */
    ({ theme, sectionSlug }) =>
      sectionSlug && theme.color.sectionsColor[sectionSlug]
        ? theme.color.sectionsColor[sectionSlug]
        : theme.color.brandColor.darkBlue
  };
  padding: 16px 24px;
  font-weight: 500;
  font-size: 18px;
  line-height: 36px;
  ${({ theme }) => theme.breakpoint.md} {
    font-weight: 400;
    font-size: 19.2px;
    padding: 19.2px 48.6px 20.8px 28.4px;
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
 * @param {Brief} props.brief
 * @param {String} [props.sectionSlug]
 * @returns {JSX.Element}
 */
export default function ArticleBrief({
  brief = { blocks: [], entityMap: {} },
  sectionSlug = '',
}) {
  return (
    <DraftRenderBlock
      rawContentBlock={brief}
      contentLayout="normal"
      wrapper={(children) => (
        <BriefContainer sectionSlug={sectionSlug}>{children}</BriefContainer>
      )}
    />
  )
}
