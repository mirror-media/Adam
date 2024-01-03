import errors from '@twreporter/errors'
import styled from 'styled-components'
import dynamic from 'next/dynamic'

import CategoryArticles from '../../components/category/category-articles'
import { GCP_PROJECT_ID, ENV } from '../../config/index.mjs'
import {
  fetchHeaderDataInDefaultPageLayout,
  fetchHeaderDataInPremiumPageLayout,
} from '../../utils/api'
import { setPageCache } from '../../utils/cache-setting'
import Layout from '../../components/shared/layout'
import { Z_INDEX } from '../../constants/index'
import {
  fetchCategoryByCategorySlug,
  fetchPostsByCategorySlug,
  fetchPremiumPostsByCategorySlug,
} from '../../utils/api/category'
import { useDisplayAd } from '../../hooks/useDisplayAd'
import { getCategoryOfWineSlug } from '../../utils'
import { getSectionGPTPageKey } from '../../utils/ad'
import WineWarning from '../../components/shared/wine-warning'
const GPTAd = dynamic(() => import('../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})
import FullScreenAds from '../../components/ads/full-screen-ads'
import GPTMbStAd from '../../components/ads/gpt/gpt-mb-st-ad'
import GPT_Placeholder from '../../components/ads/gpt/gpt-placeholder'
import { useCallback, useState } from 'react'

/**
 * @typedef {import('../../type/theme').Theme} Theme
 */

const CategoryContainer = styled.main`
  width: 320px;
  margin: 0 auto;

  ${
    /**
     * @param {Object} props
     * @param {boolean} props.isPremium
     * @param {Theme} props.theme
     */
    ({ theme }) => theme.breakpoint.md
  } {
    width: 672px;
  }
  ${
    /**
     * @param {Object} props
     * @param {boolean} props.isPremium
     * @param {Theme} props.theme
     */
    ({ theme }) => theme.breakpoint.xl
  } {
    width: 1024px;
    padding: 0;
  }

  ${
    /**
     * @param {Object} props
     * @param {boolean} props.isPremium
     * @param {Theme} props.theme
     */
    ({ isPremium, theme }) =>
      isPremium &&
      `
     margin-top: 20px;
     ${theme.breakpoint.md} {
      margin-top: 28px;
     }
     ${theme.breakpoint.xl} {
      margin-top: 36px;
     }
  `
  }
`
const CategoryTitle = styled.h1`
  margin: 20px 0 16px 16px;
  font-size: 16px;
  line-height: 1.15;
  font-weight: 500;
  color: ${
    /**
     * @param {Object} props
     * @param {string} props.sectionName
     * @param {Theme} [props.theme]
     */
    ({ sectionName, theme }) =>
      sectionName && theme.color.sectionsColor[sectionName]
        ? theme.color.sectionsColor[sectionName]
        : theme.color.brandColor.lightBlue
  };
  ${({ theme }) => theme.breakpoint.md} {
    margin: 20px 0 24px;
    font-size: 20.8px;
    font-weight: 600;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 24px 0 28px;
    font-size: 28px;
  }
`

const PremiumCategoryTitle = styled.h1`
  margin: 16px 17px;
  font-size: 16px;
  line-height: 1.15;
  font-weight: 500;
  color: ${
    /**
     * @param {Object} props
     * @param {string} props.sectionName
     * @param {Theme} [props.theme]
     */
    ({ sectionName, theme }) =>
      sectionName && theme.color.sectionsColor[sectionName]
        ? theme.color.sectionsColor[sectionName]
        : theme.color.brandColor.lightBlue
  };
  ${({ theme }) => theme.breakpoint.md} {
    margin: 20px 0 24px;
    font-size: 28px;
    font-weight: 600;
    display: flex;
    align-items: center;
    &::before,
    &::after {
      content: '';
      display: inline-block;
      height: 2px;
      background: black;
      flex-grow: 1;
    }
    &::before {
      margin-right: 30px;
    }
    &::after {
      margin-left: 40px;
    }
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 24px 0 28px;
    font-size: 28px;
  }
`

const StyledGPTAd = styled(GPTAd)`
  width: 100%;
  height: auto;
`

const StickyGPTAd = styled(GPTMbStAd)`
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

const RENDER_PAGE_SIZE = 12

/**
 * @typedef {import('../../components/category/category-articles').Article} Article
 * @typedef {import('../../components/category/category-articles').Category} Category
 */

/**
 * @param {Object} props
 * @param {Article[]} props.posts
 * @param {Category} props.category
 * @param {number} props.postsCount
 * @param {boolean} props.isPremium
 * @param {Object} props.headerData
 * @returns {React.ReactElement}
 */
export default function Category({
  postsCount,
  posts,
  category,
  isPremium,
  headerData,
}) {
  const categoryName = category.name || ''
  const shouldShowAd = useDisplayAd()

  //If no wine category, then should show gpt ST ad, otherwise, then should not show gpt ST ad.
  const isNotWineCategory = getCategoryOfWineSlug([category]).length === 0

  //The type of GPT ad to display depends on which category the section belongs to.
  //If category not have related-section, use `other` ad units
  const sectionSlug = category?.sections?.[0]?.slug ?? ''
  const GptPageKey = getSectionGPTPageKey(isPremium ? 'member' : sectionSlug)

  const [isHDAdEmpty, setISHDAdEmpty] = useState(true)

  const handleObSlotRenderEnded = useCallback((e) => {
    setISHDAdEmpty(e.isEmpty)
  }, [])

  return (
    <Layout
      head={{ title: `${categoryName}分類報導` }}
      header={{ type: isPremium ? 'premium' : 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <CategoryContainer isPremium={isPremium}>
        <GPT_Placeholder shouldTranslate={!shouldShowAd || isHDAdEmpty}>
          {shouldShowAd && (
            <StyledGPTAd
              pageKey={GptPageKey}
              adKey="HD"
              onSlotRenderEnded={handleObSlotRenderEnded}
            />
          )}
        </GPT_Placeholder>

        {isPremium ? (
          <PremiumCategoryTitle sectionName={sectionSlug}>
            {categoryName}
          </PremiumCategoryTitle>
        ) : (
          <CategoryTitle sectionName={sectionSlug}>
            {categoryName}
          </CategoryTitle>
        )}

        <CategoryArticles
          postsCount={postsCount}
          posts={posts}
          category={category}
          renderPageSize={RENDER_PAGE_SIZE}
          isPremium={isPremium}
        />

        {shouldShowAd && isNotWineCategory ? (
          <StickyGPTAd pageKey={GptPageKey} />
        ) : null}
        <WineWarning categories={[category]} />
        {isNotWineCategory && <FullScreenAds />}
      </CategoryContainer>
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ query, req, res }) {
  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 600 }, req.url)
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }
  const categorySlug = Array.isArray(query.slug) ? query.slug[0] : query.slug
  const mockError = query.error === '500'

  const traceHeader = req.headers?.['x-cloud-trace-context']
  let globalLogFields = {}
  if (traceHeader && !Array.isArray(traceHeader)) {
    const [trace] = traceHeader.split('/')
    globalLogFields[
      'logging.googleapis.com/trace'
    ] = `projects/${GCP_PROJECT_ID}/traces/${trace}`
  }

  // default category, if request failed fallback to isMemberOnly = false
  /** @type {Category} */
  let category = {
    id: '',
    name: '',
    sections: [],
    slug: categorySlug,
    isMemberOnly: false,
    state: 'inactive',
  }
  try {
    const { data } = await fetchCategoryByCategorySlug(categorySlug)
    category = data.category || category
  } catch (error) {
    const { graphQLErrors, clientErrors, networkError } = error
    const annotatingError = errors.helpers.wrap(
      error,
      'UnhandledError',
      'Error occurs while getting category page data'
    )
    console.log(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(
          annotatingError,
          {
            withStack: true,
            withPayload: true,
          },
          0,
          0
        ),
        debugPayload: {
          graphQLErrors,
          clientErrors,
          networkError,
        },
        ...globalLogFields,
      })
    )
  }

  // handle category state, if `inactive` -> redirect to 404
  if (category.state === 'inactive') {
    console.log(
      JSON.stringify({
        severity: 'WARNING',
        message: `categorySlug '${categorySlug}' is inactive, redirect to 404`,
        globalLogFields,
      })
    )
    return { notFound: true }
  }

  const isPremium = category.isMemberOnly

  const responses = await Promise.allSettled(
    isPremium
      ? [
          fetchHeaderDataInPremiumPageLayout(),
          fetchPremiumPostsByCategorySlug(
            categorySlug,
            RENDER_PAGE_SIZE * 2,
            mockError ? NaN : 0
          ),
        ]
      : [
          fetchHeaderDataInDefaultPageLayout(),
          fetchPostsByCategorySlug(
            categorySlug,
            RENDER_PAGE_SIZE * 2,
            mockError ? NaN : 0
          ),
        ]
  )

  const handledResponses = responses.map((response, index) => {
    if (response.status === 'fulfilled') {
      if ('data' in response.value) {
        // handle gql response
        return response.value.data
      }
      return response.value
    } else if (response.status === 'rejected') {
      const { graphQLErrors, clientErrors, networkError } = response.reason
      const annotatingError = errors.helpers.wrap(
        response.reason,
        'UnhandledError',
        'Error occurs while getting category page data'
      )

      console.log(
        JSON.stringify({
          severity: 'ERROR',
          message: errors.helpers.printAll(
            annotatingError,
            {
              withStack: true,
              withPayload: true,
            },
            0,
            0
          ),
          debugPayload: {
            graphQLErrors,
            clientErrors,
            networkError,
          },
          ...globalLogFields,
        })
      )

      if (index === 1) {
        // fetch key data (posts) failed, redirect to 500
        throw new Error('fetch category posts failed')
      }
      return
    }
  })

  // handle header data
  let sectionsData = []
  let topicsData = []
  const headerData = handledResponses[0]
  if (isPremium) {
    if (Array.isArray(headerData.sectionsData)) {
      sectionsData = headerData.sectionsData
    }
  } else {
    if (Array.isArray(headerData.sectionsData)) {
      sectionsData = headerData.sectionsData
    }
    if (Array.isArray(headerData.topicsData)) {
      topicsData = headerData.topicsData
    }
  }

  // handle fetch post data
  if (handledResponses[1]?.posts?.length === 0) {
    // fetchPost return empty array -> wrong authorId -> 404
    console.log(
      JSON.stringify({
        severity: 'WARNING',
        message: `fetch post of categorySlug ${categorySlug} return empty posts, redirect to 404`,
        globalLogFields,
      })
    )
    return { notFound: true }
  }
  /** @type {number} postsCount */
  const postsCount = handledResponses[1]?.postsCount || 0
  /** @type {Article[]} */
  const posts = handledResponses[1]?.posts || []

  const props = {
    postsCount,
    posts,
    category,
    isPremium,
    headerData: { sectionsData, topicsData },
  }
  return { props }
}
