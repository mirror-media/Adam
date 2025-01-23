import styled from 'styled-components'
import {
  fetchHeaderDataInDefaultPageLayout,
  fetchAnnoucementsByScope,
} from '../../utils/api'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'
import { getLogTraceObject } from '../../utils'
import {
  handleAxiosResponse,
  handleGqlResponse,
} from '../../utils/response-handle'
import { setPageCache } from '../../utils/cache-setting'
import Layout from '../../components/shared/layout'
import Steps from '../../components/subscribe-steps'
import PlanSection from '../../components/papermag/plan-selection'
import Notice from '../../components/papermag/notice'
import { ANNOUCEMENT_SCOPE } from '../../constants/announcement'

const Page = styled.main`
  min-height: 65vh;
`

const MainBody = styled.div`
  background-color: rgba(0, 0, 0, 0.05);
`

const AnnouncementBlock = styled.div`
  padding-top: 12px;
  padding-bottom: 12px;

  ${({ theme }) => theme.breakpoint.md} {
    padding-top: 24px;
    padding-bottom: 24px;
    margin-bottom: -48px;
  }
`

const AnnouncementBody = styled.div`
  display: grid;
  grid-row-gap: 8px;
  width: 90%;
  margin: 0 auto;
  border-radius: 8px;
  padding: 16px;
  background: linear-gradient(
      0deg,
      rgba(229, 23, 49, 0.05) 0%,
      rgba(229, 23, 49, 0.05) 100%
    ),
    #fff;

  ${({ theme }) => theme.breakpoint.xl} {
    width: 960px;
  }
`

const AnnouncementTitle = styled.p`
  color: #e51731;
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
`

const AnnouncementContent = styled.p`
  color: rgba(0, 0, 0, 0.66);
  text-align: justify;
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  overflow-wrap: break-word;
  word-break: break-all;
  white-space: pre-line;
`

/**
 * @typedef PageProps
 * @property {import('../../utils/api').HeadersData} sectionsData
 * @property {import('../../utils/api').Topics} topicsData
 * @property {import('../../apollo/query/announcements').Announcement[]} announcements
 */

/**
 * @param {PageProps} props
 * @returns {React.ReactNode}
 */
function PaperMag({ sectionsData = [], topicsData = [], announcements = [] }) {
  const hasAnnouncement = announcements.length > 0

  return (
    <Layout
      head={{ title: `訂閱紙本雜誌` }}
      header={{
        type: 'default',
        data: { sectionsData: sectionsData, topicsData },
      }}
      footer={{ type: 'default' }}
    >
      <Page>
        <Steps activeStep={1} />
        <MainBody>
          {hasAnnouncement && (
            <AnnouncementBlock>
              {announcements.map(({ id, title, description }) => {
                return (
                  <AnnouncementBody key={id}>
                    <AnnouncementTitle>{title}</AnnouncementTitle>
                    <AnnouncementContent>{description}</AnnouncementContent>
                  </AnnouncementBody>
                )
              })}
            </AnnouncementBlock>
          )}
          <PlanSection />
        </MainBody>
        <Notice />
      </Page>
    </Layout>
  )
}

export default PaperMag

/**
 * @type {import('next').GetServerSideProps<PageProps>}
 */
export async function getServerSideProps({ req, res }) {
  setPageCache(res, { cachePolicy: 'no-store' }, req.url)

  const globalLogFields = getLogTraceObject(req)

  // fetch header data and announcements
  const [headerResponse, announcementResponse] = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
    fetchAnnoucementsByScope([ANNOUCEMENT_SCOPE.PAPER_MAG]),
  ])

  const [sectionsData, topicsData] = handleAxiosResponse(
    headerResponse,
    getSectionAndTopicFromDefaultHeaderData,
    'Error occurs while getting header data in papermag page',
    globalLogFields
  )

  const announcements = handleGqlResponse(
    announcementResponse,
    (
      /** @type {import('../../utils/api').AnnouncementQueryResult | undefined} */ gqlData
    ) => {
      return (gqlData?.data?.announcements ?? []).filter(
        (announcement) => announcement.isActive
      )
    },
    'Error occurs while getting announcements in papermag page'
  )

  return {
    props: {
      sectionsData,
      topicsData,
      announcements,
    },
  }
}
