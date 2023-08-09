import styled from 'styled-components'
import DraftRenderBlock from './draft-renderer-block'

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
    padding: 24px 32px;
  }
  *,
  *::before,
  *::after {
    color: white;
  }
`

/**
 * Component for render brief in `normal` and `premium` story layout
 * @param {Object} props
 * @param {Brief} props.brief
 * @param {String} [props.sectionSlug]
 * @param { 'normal' | 'wide' | 'photography' | 'premium' | 'amp' } [props.contentLayout]
 * @returns {JSX.Element}
 */
export default function ArticleBrief({
  brief = { blocks: [], entityMap: {} },
  sectionSlug = '',
  contentLayout = 'normal',
}) {
  return (
    <DraftRenderBlock
      rawContentBlock={brief}
      contentLayout={contentLayout}
      wrapper={(children) => (
        <BriefContainer sectionSlug={sectionSlug}>{children}</BriefContainer>
      )}
    />
  )
}
