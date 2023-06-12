import { useState, useEffect } from 'react'
import styled from 'styled-components'
import DraftRenderBlock from '../shared/draft-renderer-block'
import ArticleBrief from '../shared/brief'
import { fetchHeaderDataInPremiumPageLayout } from '../../../utils/api'
import { sortArrayWithOtherArrayId } from '../../../utils'
import errors from '@twreporter/errors'
import TitleAndInfoAndHero from './title-and-info-and-hero'
import CopyrightWarning from '../shared/copyright-warning'
import DonateBanner from '../shared/donate-banner'
import Aside from '../shared/aside'
import { MirrorMedia } from '@mirrormedia/lilith-draft-renderer'
import NavSubtitleNavigator from '../shared/nav-subtitle-navigator'
import ButtonCopyLink from '../shared/button-copy-link'
import ButtonSocialNetworkShare from '../shared/button-social-network-share'
import DonateLink from '../shared/donate-link'
import PremiumHeader from '../../premium-header'
import ArticleMask from './article-mask'
import { useMembership } from '../../../context/membership'
const { getContentBlocksH2H3 } = MirrorMedia
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

const HeaderPlaceHolder = styled.header`
  background-color: transparent;
  height: 101px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  ${({ theme }) => theme.breakpoint.md} {
    height: 115px;
  }
`

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
 * @returns {JSX.Element}
 */
export default function StoryPremiumStyle({ postData, postContent }) {
  const [headerData, setHeaderData] = useState({
    sectionsData: [],
  })
  const { isLoggedIn } = useMembership()
  const [isHeaderDataLoaded, setIsHeaderDataLoaded] = useState(false)
  const {
    id = '',
    title,
    brief = { blocks: [], entityMap: {} },
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
    updatedAt = '',
    publishedDate = '',
    tags = [],
    heroImage = null,
    heroVideo = null,
    heroCaption = '',
    relateds = [],
    slug = '',
    content = null,
    manualOrderOfRelateds = [],
  } = postData
  const shouldShowArticleMask = !isLoggedIn || !content
  const h2AndH3Block = getContentBlocksH2H3(postContent.data)
  const sectionsWithOrdered =
    manualOrderOfSections && manualOrderOfSections.length
      ? sortArrayWithOtherArrayId(sections, manualOrderOfSections)
      : sections
  const [section] = sectionsWithOrdered
  const sectionLabelFirst = getSectionLabelFirst(sectionsWithOrdered)
  const writersWithOrdered =
    manualOrderOfWriters && manualOrderOfWriters.length
      ? sortArrayWithOtherArrayId(writers, manualOrderOfWriters)
      : writers
  const relatedsWithOrdered =
    manualOrderOfRelateds && manualOrderOfRelateds.length
      ? sortArrayWithOtherArrayId(relateds, manualOrderOfRelateds)
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

  useEffect(() => {
    let ignore = false
    fetchHeaderDataInPremiumPageLayout()
      .then((res) => {
        if (!ignore && !isHeaderDataLoaded) {
          const { sectionsData } = res
          setHeaderData({ sectionsData })
          setIsHeaderDataLoaded(true)
        }
      })
      .catch((error) => {
        if (!ignore && !isHeaderDataLoaded) {
          console.log(
            errors.helpers.printAll(
              error,
              {
                withStack: true,
                withPayload: true,
              },
              0,
              0
            )
          )
          setIsHeaderDataLoaded(true)
        }
      })

    return () => {
      ignore = true
    }
  }, [isHeaderDataLoaded])

  return (
    <>
      {isHeaderDataLoaded ? (
        <PremiumHeader
          premiumHeaderData={{
            sections: headerData.sectionsData,
          }}
          h2AndH3Block={h2AndH3Block}
          shouldShowSubtitleNavigator={true}
        ></PremiumHeader>
      ) : (
        <HeaderPlaceHolder />
      )}

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
                  <DonateLink />
                </li>
              </SocialMediaAndDonateLink>
            </NavSubtitleNavigator>
            <section className="content">
              <ArticleBrief
                sectionSlug="member"
                brief={brief}
                contentLayout="premium"
              ></ArticleBrief>
            </section>
            <section className="content">
              <DraftRenderBlock
                contentLayout="premium"
                rawContentBlock={postContent.data}
              ></DraftRenderBlock>
            </section>
            <CopyrightWarning />
            {shouldShowArticleMask && <ArticleMask postId={id} />}
            <DonateBanner />
          </ContentWrapper>
        </article>
      </Main>
      <Aside
        relateds={relatedsWithOrdered}
        sectionSlug={section?.slug || 'news'}
        storySlug={slug}
      ></Aside>
    </>
  )
}
