import Header from './header'

export default function Layout({
  children,
  sectionsData = [],
  topicsData = [],
}) {
  return (
    <>
      <Header sectionsData={sectionsData} topicsData={topicsData} />
      {children}
    </>
  )
}
