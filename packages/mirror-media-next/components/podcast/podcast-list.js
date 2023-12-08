import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import PodcastCard from './podcast-card'

const CardsWrapper = styled.ul`
  display: grid;
  row-gap: 20px;

  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: 1fr 1fr;
    grid-gap: 28px;
    gap: 28px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    row-gap: 28px;
    column-gap: 16px;
  }
`

const LoadMoreAnchor = styled.div``

const LoadingSpinner = styled.img`
  margin: auto;
`

const NoPodcastToShow = styled.div`
  width: 100%;
  height: 320px;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
    height: 470px;
  }
`

export default function PodcastList({
  selectedPodcasts,
  allPodcasts,
  selectedAuthor,
  onPodcastSelect,
  listeningPodcast,
}) {
  const [visiblePodcasts, setVisiblePodcasts] = useState(12)
  const [isLoading, setIsLoading] = useState(false)
  const loadMoreAnchorRef = useRef(null)

  useEffect(() => {
    setVisiblePodcasts(12) // Reset visiblePodcasts count when selectedAuthor changes
  }, [selectedAuthor])

  let podcastsToDisplay =
    selectedPodcasts.length > 0 ? selectedPodcasts : allPodcasts

  const loadMore = useCallback(() => {
    setIsLoading(true)
    // Simulating a time delay of 0.5 second (500ms)
    setTimeout(() => {
      setVisiblePodcasts((prevVisible) => {
        const newVisible = prevVisible + 12
        setIsLoading(newVisible < podcastsToDisplay.length)
        return newVisible
      })
    }, 500)
  }, [podcastsToDisplay.length])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMore()
          }
        })
      },
      { threshold: 0.5 }
    )

    const anchorRefCurrent = loadMoreAnchorRef.current

    if (anchorRefCurrent) {
      observer.observe(anchorRefCurrent)
    }

    return () => {
      if (anchorRefCurrent) {
        observer.unobserve(anchorRefCurrent)
      }
    }
  }, [loadMore])

  // Check if there are no podcasts for the selected author
  const noPodcastsForSelectedAuthor =
    selectedPodcasts.length === 0 &&
    selectedAuthor !== '' &&
    Object.keys(allPodcasts).every((author) => author !== selectedAuthor)

  return (
    <div>
      {noPodcastsForSelectedAuthor ? (
        <NoPodcastToShow>
          目前尚未有《{selectedAuthor}》的 Podcasts，請選擇其他作者
        </NoPodcastToShow>
      ) : podcastsToDisplay.length > 0 ? (
        <>
          <CardsWrapper>
            {podcastsToDisplay.slice(0, visiblePodcasts).map((podcast) => (
              <PodcastCard
                key={podcast.title}
                podcast={podcast}
                onPodcastSelect={onPodcastSelect}
                listeningPodcast={listeningPodcast}
              />
            ))}
          </CardsWrapper>
          <LoadMoreAnchor ref={loadMoreAnchorRef} />
          {/* Display the loading spinner when isLoading is true and there are more podcasts to load */}
          {isLoading && visiblePodcasts < podcastsToDisplay.length && (
            <LoadingSpinner src="/images-next/loading.gif" alt="Loading" />
          )}
        </>
      ) : (
        <NoPodcastToShow>
          很抱歉，目前沒有 Podcasts 可以聆聽，請重新整理再試一次
        </NoPodcastToShow>
      )}
    </div>
  )
}
