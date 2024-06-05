import { useEffect, useState } from 'react'
import styled from 'styled-components'

import client from '../../apollo/apollo-client'
import { fetchSpecials, fetchWeeklys } from '../../apollo/query/magazines'
import { fetchHeaderDataInPremiumPageLayout } from '../../utils/api'
import { getSectionFromPremiumHeaderData } from '../../utils/data-process'
import { useMembership } from '../../context/membership'
import { setPageCache } from '../../utils/cache-setting'

import MagazinePlatforms from '../../components/magazine/magazine-platforms'
import MagazineSpecials from '../../components/magazine/magazine-specials'
import MagazineWeeklys from '../../components/magazine/magazine-weeklys'
import MagazineFeatures from '../../components/magazine/magazine-featured-weeklys'
import Layout from '../../components/shared/layout'
import JoinPremiumMember from '../../components/magazine/ui-join-premium-member'
import { getLogTraceObject } from '../../utils'
import {
  handleAxiosResponse,
  handleGqlResponse,
} from '../../utils/response-handle'
import redirectToLoginWhileUnauthed from '../../utils/server-side-only/redirect-to-login-while-unauthed'
import useMembershipRequired from '../../hooks/use-membership-required'

const Section = styled.div`
  padding: 48px 0;
  ${({ theme }) => theme.breakpoint.xl} {
    padding: 60px 0;
  }
`
const Page = styled.div`
  min-height: 65vh;
  background-color: #ffffff;
  & ${Section}:nth-child(even) {
    background-color: #f2f2f2;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: -32px;
  }
`

const Title = styled.h2`
  font-weight: 500;
  font-size: 28px;
  line-height: 39px;
  text-align: center;
  letter-spacing: 1px;
  color: #4a4a4a;
  span {
    color: #054f77;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 32px;
    line-height: 45px;
    letter-spacing: 1.2px;
  }
`

/**
 * @typedef {Object} PageProps
 * @property {import('../../utils/api').HeadersData} sectionsData
 */

/**
 * @param {PageProps} props
 */
export default function Magazine({ sectionsData = [] }) {
  useMembershipRequired()
  const [specials, setSpecials] = useState([])
  const [weeklys, setWeeklys] = useState([])

  const { memberInfo } = useMembership()
  const { memberType } = memberInfo

  const isPremiumMember =
    memberType.includes('premium') || memberType.includes('staff')

  // Fetch Magazines Data only for Premium Member
  useEffect(() => {
    const fetchMagazines = async () => {
      if (isPremiumMember) {
        try {
          // Simulate an unsuccessful fetch by throwing an error
          // throw new Error('Failed to fetch magazines')
          const responses = await Promise.allSettled([
            client.query({
              query: fetchSpecials,
            }),
            client.query({
              query: fetchWeeklys,
            }),
          ])

          const fetchedSpecials = handleGqlResponse(
            responses[0],
            (gqlData) => {
              return gqlData?.data?.magazines || []
            },
            'Error occurs while getting special magazine in magazine list page'
          )

          const fetchedWeeklys = handleGqlResponse(
            responses[1],
            (gqlData) => {
              return gqlData?.data?.magazines || []
            },
            'Error occurs while getting weekly magazine in magazine list page'
          )

          setSpecials(fetchedSpecials)
          setWeeklys(fetchedWeeklys)
        } catch (error) {
          console.error(error)
        }
      }
    }

    fetchMagazines()
  }, [isPremiumMember])

  // Sort the weekly magazines
  const sortedMagazines = weeklys?.length
    ? weeklys.slice().sort((a, b) => {
        const [aIssueNumber, aVersion] = a.slug.match(/(\d+)期-(\w)本/).slice(1)
        const [bIssueNumber, bVersion] = b.slug.match(/(\d+)期-(\w)本/).slice(1)

        if (Number(bIssueNumber) !== Number(aIssueNumber)) {
          return Number(bIssueNumber) - Number(aIssueNumber)
        }

        // If issue number is the same, sort by version in ascending order
        if (bVersion !== aVersion) {
          return aVersion.localeCompare(bVersion)
        }

        // If version is also the same, maintain the original order
        return 0
      })
    : []

  return (
    <Layout
      head={{ title: `動態雜誌` }}
      header={{
        type: 'premium',
        data: { sectionsData: sectionsData },
      }}
      footer={{ type: 'default' }}
    >
      {isPremiumMember ? (
        <Page>
          {weeklys.length > 0 && (
            <>
              <Section>
                <Title>
                  當期<span>動態雜誌</span>
                </Title>
                <MagazineFeatures features={sortedMagazines.slice(0, 2)} />
              </Section>

              <Section>
                <Title>
                  近期<span>動態雜誌</span>
                </Title>
                <MagazineWeeklys weeklys={sortedMagazines.slice(2)} />
              </Section>
            </>
          )}

          <Section>
            <Title>購買線上雜誌</Title>
            <MagazinePlatforms />
          </Section>

          {specials.length > 0 && (
            <Section>
              <Title>特刊</Title>
              <MagazineSpecials specials={specials} />
            </Section>
          )}
        </Page>
      ) : (
        <JoinPremiumMember />
      )}
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps<PageProps>}
 */
export const getServerSideProps = redirectToLoginWhileUnauthed()(
  async ({ req, res }) => {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)

    const globalLogFields = getLogTraceObject(req)

    // Fetch header data
    const responses = await Promise.allSettled([
      fetchHeaderDataInPremiumPageLayout(),
    ])

    const sectionsData = handleAxiosResponse(
      responses[0],
      getSectionFromPremiumHeaderData,
      'Error occurs while getting premium header data in magazine list page',
      globalLogFields
    )

    return {
      props: {
        sectionsData,
      },
    }
  }
)
