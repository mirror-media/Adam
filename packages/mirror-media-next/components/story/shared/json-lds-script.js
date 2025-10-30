import { memo } from 'react'
import Head from 'next/head'

/**
 * @param {Object} props
 * @param {Object[]} props.jsonLdData
 */
const JsonLdsScript = ({ jsonLdData }) => {
  if (!jsonLdData || jsonLdData.length === 0) {
    return null
  }

  const structuredDataScript = jsonLdData.map((jsonLd) => {
    return (
      <script
        id={`json-ld-${jsonLd['@type']}`}
        key={`json-ld-${jsonLd['@type']}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    )
  })

  return <Head>{structuredDataScript}</Head>
}

const MemoJsonLdsScript = memo(JsonLdsScript)
export default MemoJsonLdsScript
