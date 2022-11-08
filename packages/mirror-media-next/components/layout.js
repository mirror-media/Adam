import Header from './header'

/**
 *
 * @param {Object} props
 * @param {import('../type').Section[]} props.sectionsData
 * @param {import('../type').Topic[]} props.topicsData
 * @returns {React.ReactElement}
 */
export default function Layout({ sectionsData = [], topicsData = [] }) {
  return (
    <>
      <Header sectionsData={sectionsData} topicsData={topicsData} />
    </>
  )
}
