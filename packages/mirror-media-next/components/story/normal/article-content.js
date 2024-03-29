import styled from 'styled-components'
import DraftRenderBlock from '../shared/draft-renderer-block'
import {
  copyAndSliceDraftBlock,
  getSlicedIndexAndUnstyledBlocksCount,
} from '../../../utils/story'
import dynamic from 'next/dynamic'
import useWindowDimensions from '../../../hooks/use-window-dimensions'
import { useDisplayAd } from '../../../hooks/useDisplayAd'

const GPTAd = dynamic(() => import('../../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

/**
 * @typedef {import('../../../type/draft-js').Draft} Content
 */

const Wrapper = styled.section`
  margin-top: 32px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 20px;
  }
`
const ContentContainer = styled.section`
  margin-top: 32px;
  margin-bottom: 32px;
`
//Because AT1, AT2 contain full-screen size ads content, should not set max-width and max-height
const StyledGPTAd = styled(GPTAd)`
  width: 100%;
  height: auto;

  margin: 32px auto;
  display: ${
    /**
     * @param {Object} props
     * @param {string | undefined} props.pageKey
     */
    (props) => (props.pageKey ? 'block' : 'none')
  };
`

/**
 *
 * @param {Object} props
 * @param {Content} props.content
 * @param {boolean} [props.hiddenAdvertised] - CMS Posts「google廣告違規」
 * @param {string | undefined} [props.pageKeyForGptAd]
 * @returns {JSX.Element}
 */
export default function ArticleContent({
  content = { blocks: [], entityMap: {} },
  hiddenAdvertised = false,
  pageKeyForGptAd = '',
}) {
  const shouldShowAd = useDisplayAd(hiddenAdvertised)
  const windowDimensions = useWindowDimensions()

  const { slicedIndex, unstyledBlocksCount } =
    getSlicedIndexAndUnstyledBlocksCount(content)

  //The GPT advertisement for the `mobile` version includes `AT1` & `AT2`
  const MB_contentJsx = (
    <Wrapper>
      <DraftRenderBlock
        rawContentBlock={copyAndSliceDraftBlock(content, 0, slicedIndex.mb[0])}
        contentLayout="normal"
        wrapper={(children) => <ContentContainer>{children}</ContentContainer>}
      />

      {unstyledBlocksCount > 1 && (
        <>
          {shouldShowAd && (
            <StyledGPTAd pageKey={pageKeyForGptAd} adKey="MB_AT1" />
          )}
        </>
      )}
      <DraftRenderBlock
        rawContentBlock={copyAndSliceDraftBlock(
          content,
          slicedIndex.mb[0],
          slicedIndex.mb[1]
        )}
        contentLayout="normal"
        wrapper={(children) => <ContentContainer>{children}</ContentContainer>}
      />

      {unstyledBlocksCount > 5 && (
        <>
          {shouldShowAd && (
            <StyledGPTAd pageKey={pageKeyForGptAd} adKey="MB_AT2" />
          )}
        </>
      )}
      <DraftRenderBlock
        rawContentBlock={copyAndSliceDraftBlock(content, slicedIndex.mb[1])}
        contentLayout="normal"
        wrapper={(children) => <ContentContainer>{children}</ContentContainer>}
      />
    </Wrapper>
  )

  //The GPT advertisement for the `desktop` version only `AT1`
  const PC_contentJsx = (
    <Wrapper>
      <DraftRenderBlock
        rawContentBlock={copyAndSliceDraftBlock(content, 0, slicedIndex.pc[0])}
        contentLayout="normal"
        wrapper={(children) => <ContentContainer>{children}</ContentContainer>}
      />

      {unstyledBlocksCount > 3 && (
        <>
          {shouldShowAd && (
            <StyledGPTAd pageKey={pageKeyForGptAd} adKey="PC_AT1" />
          )}
        </>
      )}
      <DraftRenderBlock
        rawContentBlock={copyAndSliceDraftBlock(content, slicedIndex.pc[0])}
        contentLayout="normal"
        wrapper={(children) => <ContentContainer>{children}</ContentContainer>}
      />
    </Wrapper>
  )

  const contentJsx =
    windowDimensions.width > 1200 ? PC_contentJsx : MB_contentJsx

  return <>{contentJsx}</>
}
