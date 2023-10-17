import { Fragment } from 'react'
import { SITE_URL } from '../../../config/index.mjs'

export default function CanonicalLink({
  slug = '',
  shouldCreateAmpHtmlLink = true,
}) {
  const nonAmpUrl = `https://${SITE_URL}/story/${slug}`
  const ampUrl = `https://${SITE_URL}/story/amp/${slug}`

  const canonicalLink = (
    <Fragment>
      <link rel="canonical" href={nonAmpUrl} />
      {shouldCreateAmpHtmlLink && <link rel="amphtml" href={ampUrl} />}
    </Fragment>
  )
  return canonicalLink
}
