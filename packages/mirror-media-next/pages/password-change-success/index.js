import styled from 'styled-components'
import { useEffect } from 'react'
import { SECOND } from '../../constants/time-unit'
import LayoutFull from '../../components/shared/layout-full'
import FormWrapper from '../../components/login/form-wrapper'
import { useRouter } from 'next/router'
import { logout } from '../../context/membership'
import { setPageCache } from '../../utils/cache-setting'
import { ENV } from '../../config/index.mjs'
import { getLogTraceObject } from '../../utils'
import { handleAxiosResponse } from '../../utils/response-handle'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'

const REDIRECTION_DELAY = 5 // 秒

const Container = styled.div`
  flex-grow: 1;

  background-color: #fff;
  ${({ theme }) => theme.breakpoint.md} {
    background-color: #f2f2f2;
  }
`

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PrimaryText = styled.p`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-weight: 500;
  line-height: 150%;
`

const SecondaryText = styled.p`
  color: rgba(0, 0, 0, 0.3);
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin-top: 32px;
`

/**
 * @typedef {Object} PageProps
 * @property {Object} headerData
 * @property {import('../../utils/api').HeadersData} headerData.sectionsData
 * @property {import('../../utils/api').Topics} headerData.topicsData
 */

/**
 * @param {PageProps} props
 */
export default function PasswordChangeSuccess({ headerData }) {
  const router = useRouter()

  useEffect(() => {
    logout()

    const task = setTimeout(
      () =>
        router.push({
          pathname: '/login',
        }),
      SECOND * REDIRECTION_DELAY
    )

    return () => {
      clearTimeout(task)
    }
  }, [router])

  return (
    <LayoutFull
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <Container>
        <Main>
          <FormWrapper>
            <PrimaryText>
              變更密碼成功！
              <br />
              請重新登入
            </PrimaryText>
            <SecondaryText>
              將於 {REDIRECTION_DELAY} 秒後自動跳轉至會員登入...
            </SecondaryText>
          </FormWrapper>
        </Main>
      </Container>
    </LayoutFull>
  )
}

/**
 * @type {import('next').GetServerSideProps<PageProps>}
 */
export async function getServerSideProps({ req, res }) {
  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 900 }, req.url)
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }

  const globalLogFields = getLogTraceObject(req)

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
  ])

  // handle header data
  const [sectionsData, topicsData] = handleAxiosResponse(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    'Error occurs while getting header data in password change success page',
    globalLogFields
  )

  return {
    props: {
      headerData: { sectionsData, topicsData },
    },
  }
}
