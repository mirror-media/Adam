import Script from 'next/script'

const MISO_SCRIPT_SRC =
  'https://cdn.jsdelivr.net/npm/@miso.ai/client-sdk@1.11.5/dist/umd/miso.min.js'

/**
 * @param {Object} props
 * @param {() => void} [props.onReady]
 * @returns {React.ReactElement}
 */
export default function MisoScript({ onReady }) {
  return (
    <Script
      async
      id="miso-client-sdk"
      src={MISO_SCRIPT_SRC}
      strategy="lazyOnload"
      onReady={onReady}
    />
  )
}
