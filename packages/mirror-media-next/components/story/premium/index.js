import styled from 'styled-components'
import dynamic from 'next/dynamic'
import ArticleBrief from '../shared/brief'
import PremiumArticleContent from './article-content'
import TitleAndInfoAndHero from './title-and-info-and-hero'
import CopyrightWarning from '../shared/copyright-warning'
import SupportMirrorMediaBanner from '../shared/support-mirrormedia-banner'
import SupportSingleArticleBanner from '../shared/support-single-article-banner'
import Aside from '../shared/aside'
import { MirrorMedia } from '@mirrormedia/lilith-draft-renderer'
import NavSubtitleNavigator from '../shared/nav-subtitle-navigator'
import ButtonCopyLink from '../shared/button-copy-link'
import ButtonSocialNetworkShare from '../shared/button-social-network-share'
import DonateLink from '../shared/donate-link'
import SubscribeLink from '../shared/subscribe-link'
import ArticleMask from '../shared/article-mask'
import { useMembership } from '../../../context/membership'
import ShareHeader from '../../shared/share-header'
import Footer from '../../shared/footer'
import { useDisplayAd } from '../../../hooks/useDisplayAd'
import { Z_INDEX } from '../../../constants/index'
import { SECTION_IDS } from '../../../constants/index'
import { getCategoryOfWineSlug, getActiveOrderSection } from '../../../utils'
const GPTAd = dynamic(() => import('../../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

const { getContentBlocksH2H3 } = MirrorMedia
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
  width: 100%;
  margin: auto;
`

const ContentWrapper = styled.section`
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  padding: 0 20px;
  border: none;
  position: relative;
  .content {
    width: 100%;
    margin: 32px auto;
    max-width: 640px;
  }
`

const SocialMediaAndDonateLink = styled.ul`
  margin-bottom: 20px;

  .subscribe-btn {
    margin-top: 12px;
  }
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

const StyledGPTAd_HD = styled(GPTAd)`
  width: 100%;
  height: auto;
  max-width: 336px;
  max-height: 280px;
  margin: 20px auto 0px;

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: 970px;
    max-height: 250px;
  }
`

const StyledGPTAd_FT = styled(GPTAd)`
  width: 100%;
  height: auto;
  max-width: 336px;
  max-height: 280px;
  margin: 20px auto;

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: 970px;
    max-height: 250px;
    margin: 35px auto;
  }
`

const StickyGPTAd_MB_ST = styled(GPTAd)`
  display: block;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: auto;
  max-width: 320px;
  max-height: 50px;
  margin: auto;
  z-index: ${Z_INDEX.coverHeader};

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const GPTAdContainer = styled.div`
  display: block;
  width: 100%;
  height: auto;
  max-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin: 24px auto 0px;

  ${({ theme }) => theme.breakpoint.xl} {
    margin: 52px auto 0px;
    max-height: 250px;
  }
`

const StyledGPTAd_E1 = styled(GPTAd)`
  display: block;
  margin: 0px auto;
  width: 100%;
  height: auto;
  max-height: 250px;
  max-width: 300px;

  ${({ theme }) => theme.breakpoint.xl} {
    margin: 0;
  }
`

const StyledGPTAd_PC_E2 = styled(GPTAd)`
  display: none;

  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    margin: 0;
    width: 100%;
    height: auto;
    max-height: 250px;
    max-width: 300px;
  }
`

/**
 * In premium article, we have to select one element in array `sections` and render it's name.
 * The logic of select title for render is :
 * 1. If the first element's slug is `member`, and second element is existed,
 * then show second element's name.
 * 2. If the first element's slug is `member`, but second element is not existed,
 * then show first element's name, which is `會員專區`.
 * 3. If the first element's slug is not `member`,
 * then show first element's name, which name is definitely not `member`.
 * @param {import('../../../apollo/fragments/section').Section[]} sections
 * @returns {string | undefined}
 */
function getSectionLabelFirst(sections) {
  if (!sections || !sections.length) {
    return undefined
  }
  if (sections?.[0]?.slug === 'member' && sections?.[1]) {
    return sections?.[1]?.name
  } else {
    return sections?.[0]?.name
  }
}

/**
 *
 * @param {Object} props
 * @param {PostData} props.postData
 * @param {PostContent} props.postContent
 * @param {any} props.headerData
 * @returns {JSX.Element}
 */
export default function StoryPremiumStyle({
  postData,
  postContent,
  headerData,
}) {
  const { isLoggedIn, memberInfo } = useMembership()
  const { memberType } = memberInfo

  const {
    id = '',
    title,
    brief = { blocks: [], entityMap: {} },
    sections = [],
    categories = [],
    sectionsInInputOrder = [],
    writers = [],
    writersInInputOrder = [],
    photographers = [],
    camera_man = [],
    designers = [],
    engineers = [],
    vocals = [],
    extend_byline = '',
    updatedAt = '',
    publishedDate = '',
    tags = [],
    heroImage = null,
    heroVideo = null,
    heroCaption = '',
    relateds = [],
    relatedsInInputOrder = [],
    slug = '',
    hiddenAdvertised = false,
    isAdvertised = false,
  } = postData

  const shouldShowArticleMask =
    !isLoggedIn || postContent.type === 'trimmedContent'
  const h2AndH3Block = getContentBlocksH2H3(postContent.data)

  const sectionsWithOrdered = getActiveOrderSection(
    sections,
    sectionsInInputOrder
  )
  const [section] = sectionsWithOrdered
  const sectionLabelFirst = getSectionLabelFirst(sectionsWithOrdered)
  const writersWithOrdered =
    writersInInputOrder && writersInInputOrder.length
      ? writersInInputOrder
      : writers
  const relatedsWithOrdered =
    relatedsInInputOrder && relatedsInInputOrder.length
      ? relatedsInInputOrder
      : relateds
  const credits = [
    { writers: writersWithOrdered },
    { photographers: photographers },
    { camera_man: camera_man },
    { designers: designers },
    { engineers: engineers },
    { vocals: vocals },
    { extend_byline: extend_byline },
  ]
  const pageKeyForGptAd = isAdvertised ? 'other' : SECTION_IDS['member']

  const shouldShowAd = useDisplayAd(hiddenAdvertised)

  let supportBanner
  if (postContent.type === 'fullContent') {
    if (memberType === 'one-time-member') {
      supportBanner = <SupportMirrorMediaBanner />
    } else {
      supportBanner = <SupportSingleArticleBanner />
    }
  }

  //If no wine category, then should show gpt ST ad, otherwise, then should not show gpt ST ad.
  const noCategoryOfWineSlug = getCategoryOfWineSlug(categories).length === 0
  return (
    <>
      <ShareHeader
        pageLayoutType="premium"
        headerData={{
          sectionsData: headerData?.sectionsData,
          h2AndH3Block: h2AndH3Block,
        }}
      />

      {shouldShowAd && <StyledGPTAd_HD pageKey={pageKeyForGptAd} adKey="HD" />}

      <Main>
        <article>
          <TitleAndInfoAndHero
            sectionLabelFirst={sectionLabelFirst}
            title={title}
            heroImage={heroImage}
            heroVideo={heroVideo}
            heroCaption={heroCaption}
            credits={credits}
            publishedDate={publishedDate}
            updatedAt={updatedAt}
            tags={tags}
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
                <li>
                  <DonateLink className="GTM-donate-link-side" />
                  {(memberType === 'not-member' ||
                    memberType === 'basic-member' ||
                    memberType === 'one-time-member') && (
                    <SubscribeLink className="subscribe-btn GTM-subscribe-link-side" />
                  )}
                </li>
              </SocialMediaAndDonateLink>
            </NavSubtitleNavigator>
            <section className="content">
              <ArticleBrief
                sectionSlug="member"
                brief={brief}
                contentLayout="premium"
              />
            </section>
            <PremiumArticleContent
              className="content"
              content={postContent.data}
              hiddenAdvertised={hiddenAdvertised}
              pageKeyForGptAd={pageKeyForGptAd}
            />
            <CopyrightWarning />
            {shouldShowArticleMask && <ArticleMask postId={id} />}
            {supportBanner}
            {shouldShowAd && (
              <GPTAdContainer>
                <StyledGPTAd_E1 pageKey={pageKeyForGptAd} adKey="E1" />
                <StyledGPTAd_PC_E2 pageKey={pageKeyForGptAd} adKey="PC_E2" />
              </GPTAdContainer>
            )}
          </ContentWrapper>
        </article>
      </Main>

      <Aside
        relateds={relatedsWithOrdered}
        sectionSlug={section?.slug || 'news'}
        storySlug={slug}
      />

      {shouldShowAd && <StyledGPTAd_FT pageKey={pageKeyForGptAd} adKey="FT" />}
      {shouldShowAd && noCategoryOfWineSlug ? (
        <StickyGPTAd_MB_ST pageKey={pageKeyForGptAd} adKey="MB_ST" />
      ) : null}

      <Footer footerType="default" />
    </>
  )
}
