//TODO: add jsDoc for credits

import styled from 'styled-components'
import DraftRenderBlock from '../shared/draft-renderer-block'
import { MirrorMedia } from '@mirrormedia/lilith-draft-renderer'
const { getContentBlocksH2H3 } = MirrorMedia
import { useMembership } from '../../../context/membership'

import Header from './header'
import ArticleMask from '../shared/article-mask'
import DonateLink from '../shared/donate-link'
import SubscribeLink from '../shared/subscribe-link'
import HeroImageAndVideo from '../shared/hero-image-and-video'
import Credits from '../shared/credits'
import SupportMirrorMediaBanner from '../shared/support-mirrormedia-banner'
import SupportSingleArticleBanner from '../shared/support-single-article-banner'
import NavSubtitleNavigator from '../shared/nav-subtitle-navigator'
import MoreInfoAndTag from '../shared/more-info-and-tag'
import Date from '../shared/date'
import ButtonCopyLink from '../shared/button-copy-link'
import ButtonSocialNetworkShare from '../shared/button-social-network-share'
import Aside from '../shared/aside'
import { getActiveOrderSection } from '../../../utils'
import ArticleBrief from '../shared/brief'

/**
 * @typedef {import('../../../apollo/fragments/post').Post} PostData
 */

/**
 * @typedef {Object} PostContent
 * @property {'fullContent' | 'trimmedContent'} type
 * @property {Pick<PostData,'content'>['content']} data
 * @property {boolean} isLoaded
 */

/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */
const Main = styled.main`
  margin: auto;
  width: 100%;

  background-color: white;
`

const DateWrapper = styled.div`
  margin-top: 16px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 20px;
  }
`
const StyledDate = styled(Date)`
  margin: 8px auto 0;

  ${({ theme }) => theme.breakpoint.md} {
    margin: 0 auto;
  }
`
const ContentWrapper = styled.section`
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  padding: 0 20px 20px;
  border: none;
  position: relative;
  .content {
    width: 100%;
    margin: 20px auto 0;
  }

  ${({ theme }) => theme.breakpoint.md} {
    border-bottom: 1px black solid;
    .content {
      margin: 40px auto 0;
    }
  }
`

const SocialMediaAndDonateLink = styled.ul`
  margin-bottom: 20px;
`

const SocialMedia = styled.li`
  display: none;
  ${({ theme }) => theme.breakpoint.md} {
    display: flex;
    margin-bottom: 12px;
    a {
      margin-right: 10px;
    }
  }
`
const StyledCredits = styled(Credits)`
  margin-left: auto;
  margin-right: auto;
`

const DonateSubscribeWrapper = styled.div`
  display: flex;
  justify-content: center;

  margin-top: 20px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 12px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 24px;
  }

  .subscribe-btn {
    margin-left: 8px;
  }
`

const BriefWrapper = styled.div`
  margin: 32px 0;
`

/**
 *
 * @param {Object} param
 * @param {PostData} param.postData
 * @param {PostContent} param.postContent
 * @param {string} [param.classNameForGTM]
 * @returns {JSX.Element}
 */
export default function StoryWideStyle({
  postData,
  postContent,
  classNameForGTM = '',
}) {
  const {
    id = '',
    title = '',
    subtitle = '',
    heroImage = null,
    heroVideo = null,
    heroCaption = '',
    updatedAt = '',
    publishedDate = '',
    sections = [],
    sectionsInInputOrder = [],
    writers = [],
    writersInInputOrder = [],
    photographers = [],
    camera_man = [],
    designers = [],
    engineers = [],
    vocals = [],
    extend_byline = '',

    relateds = [],
    relatedsInInputOrder = [],
    slug = '',
    brief = null,
    tags = [],
  } = postData

  const sectionsWithOrdered = getActiveOrderSection(
    sections,
    sectionsInInputOrder
  )
  const [section] = sectionsWithOrdered

  const relatedsWithOrdered =
    relatedsInInputOrder && relatedsInInputOrder.length
      ? relatedsInInputOrder
      : relateds

  const writersWithOrdered =
    writersInInputOrder && writersInInputOrder.length
      ? writersInInputOrder
      : writers

  const credits = [
    { writers: writersWithOrdered },
    { photographers: photographers },
    { camera_man: camera_man },
    { designers: designers },
    { engineers: engineers },
    { vocals: vocals },
    { extend_byline: extend_byline },
  ]

  const h2AndH3Block = getContentBlocksH2H3(postContent.data)

  const shouldShowArticleMask = postContent.type === 'trimmedContent'

  const { memberInfo } = useMembership()
  const { memberType } = memberInfo
  const isPremiumMember =
    memberType.includes('premium') || memberType.includes('staff')

  let supportBanner

  if (!shouldShowArticleMask) {
    if (isPremiumMember) {
      supportBanner = <SupportSingleArticleBanner />
    } else {
      supportBanner = <SupportMirrorMediaBanner />
    }
  }

  return (
    <>
      <Header h2AndH3Block={h2AndH3Block} />
      <Main className={classNameForGTM}>
        <article>
          <HeroImageAndVideo
            heroImage={heroImage}
            heroVideo={heroVideo}
            heroCaption={heroCaption}
            title={title}
            subtitle={subtitle}
          />
          <ContentWrapper>
            <NavSubtitleNavigator h2AndH3Block={h2AndH3Block}>
              <SocialMediaAndDonateLink>
                <SocialMedia>
                  <ButtonSocialNetworkShare
                    type="facebook"
                    width={28}
                    height={28}
                  />
                  <ButtonSocialNetworkShare
                    type="line"
                    width={28}
                    height={28}
                  />
                  <ButtonCopyLink width={28} height={28} />
                </SocialMedia>
              </SocialMediaAndDonateLink>
            </NavSubtitleNavigator>
            <StyledCredits credits={credits}></StyledCredits>
            <DateWrapper>
              <StyledDate timeData={publishedDate} timeType="publishedDate" />
              <StyledDate timeData={updatedAt} timeType="updatedDate" />
            </DateWrapper>
            <DonateSubscribeWrapper>
              <DonateLink className="GTM-donate-link-top" />
              <SubscribeLink className="subscribe-btn GTM-subscribe-link-top" />
            </DonateSubscribeWrapper>
            <section className="content">
              <BriefWrapper>
                <ArticleBrief
                  sectionSlug="member"
                  brief={brief}
                  contentLayout="wide"
                />
              </BriefWrapper>
              <DraftRenderBlock
                rawContentBlock={postContent.data}
                contentLayout="wide"
              />
            </section>
            <MoreInfoAndTag tags={tags} />

            {shouldShowArticleMask && <ArticleMask postId={id} />}
            {supportBanner}
          </ContentWrapper>
          <Aside
            relateds={relatedsWithOrdered}
            sectionSlug={section?.slug || 'news'}
            storySlug={slug}
          ></Aside>
        </article>
      </Main>
    </>
  )
}
