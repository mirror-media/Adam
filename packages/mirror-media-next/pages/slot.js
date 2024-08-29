import errors from '@twreporter/errors'
import { ENV } from '../config'

import Layout from '../components/shared/layout'

import { setPageCache } from '../utils/cache-setting'
import { fetchHeaderDataInDefaultPageLayout } from '../utils/api'
import Slot from '../components/slot/slot-and-banner'

/**
 *
 * @param {Object} props
 * @param {any} props.headerData
 * @returns {JSX.Element}
 */
export default function SlotPage({ headerData = {} }) {
  const { sectionsData = [], topicsData = [] } = headerData

  return (
    <Layout
      head={{ title: `拉霸機測試` }}
      header={{
        type: 'default',
        data: { sectionsData: sectionsData, topicsData },
      }}
      footer={{ type: 'default' }}
    >
      <Slot />
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ req, res }) {
  if (ENV === 'prod' || ENV === 'staging') {
    return {
      notFound: true,
    }
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }

  let headerData
  try {
    headerData = await fetchHeaderDataInDefaultPageLayout()
  } catch (err) {
    const { graphQLErrors, clientErrors, networkError } = err
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while getting story page data'
    )

    const errorMessage = errors.helpers.printAll(
      annotatingError,
      {
        withStack: true,
        withPayload: true,
      },
      0,
      0
    )
    console.log(
      JSON.stringify({
        severity: 'ERROR',
        message: errorMessage,
        debugPayload: {
          graphQLErrors,
          clientErrors,
          networkError,
        },
      })
    )
    throw new Error(errorMessage)
  }
  return {
    props: {
      headerData,
    },
  }
}
