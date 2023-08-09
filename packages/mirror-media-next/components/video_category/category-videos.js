import styled from 'styled-components'
import Image from 'next/legacy/image'
import LoadingPage from '../../public/images/loading_page.gif'
import InfiniteScrollList from '../infinite-scroll-list'
import { useState } from 'react'
import { simplifyYoutubePlaylistVideo } from '../../utils/youtube.js'
import VideoList from './video-list.js'
import { fetchYoutubePlaylistByPlaylistId } from '../../utils/api/video-category'
import { VIDEOHUB_CATEGORIES_PLAYLIST_MAPPING } from '../../constants'

const Loading = styled.div`
  margin: 20px auto 0;
  padding: 0 0 20px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.xl} {
    margin: 64px auto 0;
    padding: 0 0 64px;
  }
`

export default function CategoryVideos({
  videoItems,
  initialNextPageToken,
  categorySlug,
}) {
  const [nextPageToken, setNextPageToken] = useState(initialNextPageToken)
  const [count, setCount] = useState(1)

  const playlistId = VIDEOHUB_CATEGORIES_PLAYLIST_MAPPING[categorySlug]

  async function fetchYoutubeVideo(nextToken) {
    if (!playlistId) {
      // set nextPageToken to empty string to stop infinite scroll
      setNextPageToken('')
      return
    }
    try {
      const response = await fetchYoutubePlaylistByPlaylistId(
        playlistId,
        nextToken
      )
      const nextPageToken = response.data.nextPageToken
      setNextPageToken(nextPageToken)
      setCount((count) => count + 1)
      return simplifyYoutubePlaylistVideo(
        response.data.items.filter(
          (item) => item.status.privacyStatus === 'public'
        )
      )
    } catch (error) {
      // [to-do]: use beacon api to log error on gcs
      console.error(error)
      // set nextPageToken to empty string to stop infinite scroll
      setNextPageToken('')
      return
    }
  }

  const loader = (
    <Loading key={0}>
      <Image src={LoadingPage} alt="loading page"></Image>
    </Loading>
  )

  return (
    <InfiniteScrollList
      initialList={videoItems}
      renderAmount={15}
      fetchListInPage={fetchYoutubeVideo.bind(null, nextPageToken)}
      fetchCount={nextPageToken ? count + 2 : count}
      loader={loader}
    >
      {(renderList) => <VideoList videos={renderList} />}
    </InfiniteScrollList>
  )
}
