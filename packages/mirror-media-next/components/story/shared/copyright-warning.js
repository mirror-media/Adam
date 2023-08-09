import styled from 'styled-components'
import Link from 'next/link'

/**
 * Component for describe copyright of article, and have more information for mirror media.
 * Used in the below the content of the article.
 * Currently used in story page wide and premium layout.
 * @typedef {import('../../../type/theme').Theme} Theme
 */

const CopyrightWarningText = styled.p`
  display: none;
  ${({ theme }) => theme.breakpoint.md} {
    display: block;
    margin-top: 32px;
    color: rgba(0, 0, 0, 0.5);
    font-size: 14px;
    line-height: 1.8;
  }
`
const MornInfoText = styled.p`
  display: none;
  ${
    /**
     * @param {{theme: Theme}} param
     */
    ({ theme }) => theme.breakpoint.md
  } {
    display: block;
    margin-top: 8px;
    color: rgba(0, 0, 0, 0.5);
    font-size: 14px;
    line-height: 1.8;
  }
  .link {
    color: ${({ theme }) => theme.color.brandColor.darkBlue};
  }
`
export default function CopyrightWarning() {
  return (
    <>
      <CopyrightWarningText>
        本新聞文字、照片、影片專供鏡週刊會員閱覽，未經鏡週刊授權，任何媒體、社群網站、論壇等均不得引用、改寫、轉貼，以免訟累。
      </CopyrightWarningText>
      <MornInfoText>
        更多內容，歡迎
        <Link className="link" href="/papermag">
          訂閱鏡週刊
        </Link>
        、
        <Link className="link" href="/story/webauthorize">
          了解內容授權資訊
        </Link>
        。
      </MornInfoText>
    </>
  )
}
