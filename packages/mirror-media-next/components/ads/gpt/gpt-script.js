import Script from 'next/script'

export default function GPTScript() {
  return (
    <>
      <Script
        async
        strategy="afterInteractive"
        src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
      />
    </>
  )
}
