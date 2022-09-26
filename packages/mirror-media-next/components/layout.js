import Header from './header'

export default function Layout({
  children,
  sectionsData = [],
  topicsData = [],
}) {
  console.log('layout', sectionsData)
  console.log('layout', topicsData)
  return (
    <>
      <Header sectionsData={sectionsData} topicsData={topicsData} />
      {children}
    </>
  )
}
