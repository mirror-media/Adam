import { useState } from 'react'
import styled from 'styled-components'
import AudioPlayer from '../../components/podcast/audio-player'
import Dropdown from '../../components/podcast/author-select-dropdown'
import PodcastList from '../../components/podcast/podcast-list'
import Layout from '../../components/shared/layout'
import { ENV } from '../../config/index.mjs'
import {
  fetchHeaderDataInDefaultPageLayout,
  fetchPodcastList,
} from '../../utils/api'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'
import { setPageCache } from '../../utils/cache-setting'
import { getLogTraceObject } from '../../utils'
import { handleAxiosResponse } from '../../utils/response-handle'

/**
 * @typedef {import('../../components/header/share-header').HeaderData} HeaderData
 */

const PageWrapper = styled.main`
  margin: auto;

  ${({ theme }) => theme.breakpoint.md} {
    width: 516px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 1024px;
  }
`

const TitleSelectorWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 15px 16px;
  ${({ theme }) => theme.breakpoint.md} {
    padding: 20px 0;
  }
`

const Title = styled.p`
  color: #000;
  font-size: 16px;
  font-weight: 500;
  line-height: 115%;
  letter-spacing: 0.5px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 20px;
    font-weight: 600;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 28px;
  }
`

/**
 * @typedef {Object} Enclosure
 * @property {string} url
 * @property {number} file_size
 * @property {string} mime_type
 */

/**
 * @typedef {Object} PodcastData
 * @property {string} published
 * @property {string} author
 * @property {string} description
 * @property {string} heroImage
 * @property {Enclosure[]} enclosures
 * @property {string} link
 * @property {string} guid
 * @property {string} title
 * @property {string} duration
 */

/**
 * @typedef {Object} Props
 * @property {Object} headerData
 * @property {PodcastData[]} podcastListData
 */

/**
 * @param {Props} props
 * @returns {React.ReactElement}
 */

export default function Podcast({ headerData, podcastListData }) {
  const [selectedPodcasts, setSelectedPodcasts] = useState([])
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [listeningPodcast, setListeningPodcast] = useState(null)

  const handlePodcastSelect = (podcast) => {
    setListeningPodcast(podcast)
  }

  // Function to group podcasts by author
  function groupPodcastsByAuthor(podcasts) {
    return podcasts.reduce((grouped, podcast) => {
      const author = podcast.author
      const podcastsForAuthor = grouped[author] || []
      return {
        ...grouped,
        [author]: podcastsForAuthor.concat(podcast),
      }
    }, {})
  }

  // Get the grouped podcasts by author
  const groupedPodcasts = groupPodcastsByAuthor(podcastListData)
  const allAuthors = '全部'

  // Display podcasts for a selected author or all podcasts
  function displayPodcastsByAuthor(selectedAuthor) {
    setSelectedAuthor(selectedAuthor)
    if (selectedAuthor === allAuthors) {
      setSelectedPodcasts(podcastListData) // Set selectedPodcasts to entire list
    } else {
      const podcastsForAuthor = groupedPodcasts[selectedAuthor]
      if (podcastsForAuthor) {
        setSelectedPodcasts(podcastsForAuthor)
      } else {
        setSelectedPodcasts([]) // No podcasts found for selectedAuthor
      }
    }
  }

  const authors = [
    allAuthors,
    '鏡週刊理財組',
    '鏡週刊調查組',
    '鏡週刊社會組',
    '鏡週刊人物組',
    '鏡週刊財經組',
    '鏡週刊美食旅遊組',
    '鏡週刊娛樂產業組',
    '鏡週刊財經人物組',
    '鏡車誌',
    '鏡錶誌',
  ]

  return (
    <Layout
      head={{ title: 'Podcasts' }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <PageWrapper>
        <TitleSelectorWrapper>
          <Title>Podcasts</Title>
          <Dropdown
            authors={authors}
            displayPodcastsByAuthor={displayPodcastsByAuthor}
          />
        </TitleSelectorWrapper>
        <PodcastList
          selectedPodcasts={selectedPodcasts}
          allPodcasts={podcastListData}
          selectedAuthor={selectedAuthor}
          onPodcastSelect={handlePodcastSelect}
          listeningPodcast={listeningPodcast}
        />
        {listeningPodcast && ( // Display AudioPlayer only if a podcast is selected
          <AudioPlayer listeningPodcast={listeningPodcast} />
        )}
      </PageWrapper>
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ req, res }) {
  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 600 }, req.url)
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }

  const globalLogFields = getLogTraceObject(req)

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
    fetchPodcastList(),
  ])

  // handle header data
  const [sectionsData, topicsData] = handleAxiosResponse(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    'Error occurs while getting header data in podcasts page',
    globalLogFields
  )

  // Extracting podcast list data
  /** @type {PodcastData[]} */
  const podcastListData = handleAxiosResponse(
    responses[1],
    (
      /** @type {Awaited<ReturnType<typeof fetchPodcastList>> | undefined} */ axiosData
    ) => {
      return axiosData?.data ?? []
    },
    'Error occurs while getting podcast list in podcasts page',
    globalLogFields
  )

  if (podcastListData.length === 0) {
    return {
      notFound: true,
    }
  }

  const props = {
    headerData: { sectionsData, topicsData },
    podcastListData: podcastListData,
  }

  return { props }
}
