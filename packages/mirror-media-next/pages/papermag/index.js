import styled from 'styled-components'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'
import { getLogTraceObject } from '../../utils'
import { handleAxiosResponse } from '../../utils/response-handle'
import { setPageCache } from '../../utils/cache-setting'
import Layout from '../../components/shared/layout'
import Steps from '../../components/subscribe-steps'
import PlanSection from '../../components/papermag/plan-selection'
import Notice from '../../components/papermag/notice'
import { ACCESS_PAPERMAG_FEATURE_TOGGLE } from '../../config/index.mjs'

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
 * @param {Object} props
 * @param {import('../../utils/api').HeadersData} props.sectionsData
 * @param {import('../../utils/api').Topics} props.topicsData
 * @returns {React.ReactNode}
 */
function PaperMag({ sectionsData = [], topicsData = [] }) {
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
          {/* TODO: Annoucement 的顯示與內容由 CMS list 控制 */}
          <AnnouncementBlock>
            <AnnouncementBody>
              <AnnouncementTitle>[1月份訂戶派送異動公告]</AnnouncementTitle>
              <AnnouncementContent>
                {`預祝新春如意！造成困擾敬請見諒。
                  第434期(原1/22)提前於1/21出刊，1/22完成配送。
                  第435期(原1/29)提前於1/25出刊，因逢春節期間延至2/3起配送。`}
              </AnnouncementContent>
            </AnnouncementBody>
          </AnnouncementBlock>
          <PlanSection />
        </MainBody>
        <Notice />
      </Page>
    </Layout>
  )
}

export default PaperMag

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ req, res }) {
  setPageCache(res, { cachePolicy: 'no-store' }, req.url)

  if (ACCESS_PAPERMAG_FEATURE_TOGGLE !== 'on') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const globalLogFields = getLogTraceObject(req)

  // Fetch header data
  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
  ])

  const [sectionsData, topicsData] = handleAxiosResponse(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    'Error occurs while getting header data in papermag page',
    globalLogFields
  )

  return {
    props: {
      sectionsData,
      topicsData,
    },
  }
}
