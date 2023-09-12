import styled from 'styled-components'
import { transformTimeDataIntoSlashFormat } from '../../utils'
import ButtonCopyLink from '../story/shared/button-copy-link'
import ButtonSocialNetworkShare from '../story/shared/button-social-network-share'
const Wrapper = styled.div`
  padding: 0 16px;
  ${({ theme }) => theme.breakpoint.md} {
    padding: unset;
  }
`

const Title = styled.h2`
  font-size: 20px;
  font-weight: 400;
  line-height: 1.4;
  color: #4a4a4a;
  ${({ theme }) => theme.breakpoint.md} {
    font-size: 24px;
    font-weight: 500;
    line-height: 1.5;
  }
`
const Date = styled.p`
  font-size: 14px;
  line-height: 1.4;
  color: #9b9b9b;
  margin-top: 4px;
  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
    line-height: 1.5;
    margin-top: 12px;
  }
`

const Description = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: #9b9b9b;
  margin-top: 20px;
  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
    font-weight: 400;
    margin-top: 28px;
  }

  > a {
    text-decoration: underline;
  }
`

const ShareIcons = styled.div`
  display: flex;
  column-gap: 16px;
  margin-top: 20px;
  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 28px;
  }
`

/**
 * @param {Object} props
 * @param {import('../../type/youtube').YoutubeVideo} props.video
 * @returns
 */
export default function YoutubeArticle({ video }) {
  const description = video.description
    ?.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>')
    .replace(/↵|\n/g, '<br>')
    .split('-----')[0]

  return (
    <Wrapper>
      {video.title && <Title>{video.title}</Title>}
      {video.publishedAt && (
        <Date>{transformTimeDataIntoSlashFormat(video.publishedAt)}</Date>
      )}
      {video.description && (
        <Description dangerouslySetInnerHTML={{ __html: description }} />
      )}
      <ShareIcons>
        <ButtonSocialNetworkShare width={40} height={40} type="facebook" />
        <ButtonSocialNetworkShare width={40} height={40} type="line" />
        <ButtonCopyLink width={40} height={40} />
      </ShareIcons>
    </Wrapper>
  )
}
