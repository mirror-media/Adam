import Header from './header'

/**
 *
 * @param {Object} props
 * @param {Object[]} props.sectionsData
 * @param {Object[]} props.topicsData
 * @returns {React.ReactElement}
 */
export default function Layout({ sectionsData = [], topicsData = [] }) {
  return (
    <>
      <Header sectionsData={sectionsData} topicsData={topicsData} />
    </>
  )
}
