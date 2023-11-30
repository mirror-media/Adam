export default function PodcastList({
  selectedPodcasts,
  allPodcasts,
  selectedAuthor,
}) {
  console.log({ selectedPodcasts, allPodcasts })

  let podcastsToDisplay =
    selectedPodcasts.length > 0 ? selectedPodcasts : allPodcasts

  // Check if there are no podcasts for the selected author
  const noPodcastsForSelectedAuthor =
    selectedPodcasts.length === 0 &&
    selectedAuthor !== '' &&
    Object.keys(allPodcasts).every((author) => author !== selectedAuthor)

  return (
    <div>
      {noPodcastsForSelectedAuthor ? (
        <p>There are no podcasts for the selected author, {selectedAuthor}.</p>
      ) : podcastsToDisplay.length > 0 ? (
        podcastsToDisplay.map((podcast, index) => (
          <p key={index}>{podcast.title}</p>
        ))
      ) : (
        <p>There are no podcasts available.</p>
      )}
    </div>
  )
}
