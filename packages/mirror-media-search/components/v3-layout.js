import Header from '../components/header/v3'

export default function V3Layout({
  sectionsData = [],
  topicsData = [],
  children,
}) {
  return (
    <>
      <Header sectionsData={sectionsData} topicsData={topicsData} />
      {children}
    </>
  )
}
