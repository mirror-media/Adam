import Header from './shared/mirror-media-header-old'
import Footer from './shared/mirror-media-footer'

export default function Layout({
  sectionsData = [],
  topicsData = [],
  children,
}) {
  return (
    <>
      <Header sectionsData={sectionsData} topicsData={topicsData} />
      {children}
      <Footer />
    </>
  )
}
