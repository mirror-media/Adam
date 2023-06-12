//TODO: add jsDoc for credits

import styled from 'styled-components'
import DraftRenderBlock from '../shared/draft-renderer-block'
import { MirrorMedia } from '@mirrormedia/lilith-draft-renderer'
const { getContentBlocksH2H3 } = MirrorMedia
import { sortArrayWithOtherArrayId } from '../../../utils'

import Header from './header'
import DonateLink from '../shared/donate-link'
import HeroImageAndVideo from '../shared/hero-image-and-video'
import Credits from '../shared/credits'
import DonateBanner from '../shared/donate-banner'
import NavSubtitleNavigator from '../shared/nav-subtitle-navigator'
import MoreInfoAndTag from '../shared/more-info-and-tag'
import Date from '../shared/date'
import ButtonCopyLink from '../shared/button-copy-link'
import ButtonSocialNetworkShare from '../shared/button-social-network-share'
import Aside from '../shared/aside'
/**
 * @typedef {import('../../../apollo/fragments/post').Post} PostData
 */

/**
 * @typedef {Object} PostContent
 * @property {'fullContent' | 'trimmedContent'} type
 * @property {Pick<PostData,'content'>['content']} data
 */

/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */
const Main = styled.main`
  margin: auto;
  width: 100%;

  background-color: white;
`
const StyledDonateLink = styled(DonateLink)`
  margin: 20px auto 0;
  ${({ theme }) => theme.breakpoint.md} {
    margin: 12px auto 0;
  }
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
const StyledDonateBanner = styled(DonateBanner)`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
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
/**
 *
 * @param {Object} param
 * @param {PostData} param.postData
 * @param {PostContent} param.postContent
 * @returns {JSX.Element}
 */
export default function StoryWideStyle({ postData, postContent }) {
  const {
    title = '',
    heroImage = null,
    heroVideo = null,
    heroCaption = '',
    updatedAt = '',
    publishedDate = '',
    sections = [],
    manualOrderOfSections = [],
    writers = [],
    manualOrderOfWriters = [],
    photographers = [],
    camera_man = [],
    designers = [],
    engineers = [],
    vocals = [],
    extend_byline = '',

    relateds = [],
    manualOrderOfRelateds = [],
    slug = '',
    brief = null,
    tags = [],
  } = postData
  const sectionsWithOrdered =
    manualOrderOfSections && manualOrderOfSections.length
      ? sortArrayWithOtherArrayId(sections, manualOrderOfSections)
      : sections
  const [section] = sectionsWithOrdered

  const relatedsWithOrdered =
    manualOrderOfRelateds && manualOrderOfRelateds.length
      ? sortArrayWithOtherArrayId(relateds, manualOrderOfRelateds)
      : relateds

  const writersWithOrdered =
    manualOrderOfWriters && manualOrderOfWriters.length
      ? sortArrayWithOtherArrayId(writers, manualOrderOfWriters)
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

  return (
    <>
      <Header h2AndH3Block={h2AndH3Block} />
      <Main>
        <article>
          <HeroImageAndVideo
            heroImage={heroImage}
            heroVideo={heroVideo}
            heroCaption={heroCaption}
            title={title}
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
                {/* <li>
                <DonateLink />
              </li> */}
              </SocialMediaAndDonateLink>
            </NavSubtitleNavigator>
            <StyledCredits credits={credits}></StyledCredits>
            <DateWrapper>
              <StyledDate timeData={publishedDate} timeType="publishedDate" />
              <StyledDate timeData={updatedAt} timeType="updatedDate" />
            </DateWrapper>
            <StyledDonateLink />
            <section className="content">
              <DraftRenderBlock rawContentBlock={brief} contentLayout="wide" />
              <DraftRenderBlock
                rawContentBlock={postContent.data}
                contentLayout="wide"
              />
            </section>
            <MoreInfoAndTag tags={tags} />
            <StyledDonateBanner />
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
