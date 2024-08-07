import { useRouter } from 'next/router'
import Head from 'next/head'

/**
 * Component for implement comScore script.
 * There are two different script, one for amp type page, one for other.
 * See amp Docs to get more info about comScore amp page script: https://direct-support.comscore.com/hc/en-us/article_attachments/360058526434
 *
 */
export default function ComScoreScript() {
  const router = useRouter()
  const { pathname } = router
  const isAmpStoryPage =
    pathname.startsWith('/story/amp/') || pathname.startsWith('/external/amp/')
  if (isAmpStoryPage) {
    return (
      <>
        <Head>
          <script
            async
            // eslint-disable-next-line react/no-unknown-property
            custom-element="amp-analytics"
            src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
          ></script>
        </Head>

        {/* @ts-ignore */}
        <amp-analytics type="comscore">
          <script
            type="application/json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                vars: {
                  c2: '24318560',
                },
                extraUrlParams: {
                  comscorekw: 'amp',
                },
              }),
            }}
          ></script>
          {/* @ts-ignore */}
        </amp-analytics>
      </>
    )
  }

  return (
    // use react script rather than next/Script to let the script show on the source of the html (view-source:)
    <>
      <script
        id="comScore"
        dangerouslySetInnerHTML={{
          __html: `
            var _comscore = _comscore || [];
            _comscore.push({ c1: "2", c2: "24318560" ,  options: { enableFirstPartyCookie: "true" } });
            (function() {
              var s = document.createElement("script"), el = document.getElementsByTagName("script")[0]; s.async = true;
              s.src = "https://sb.scorecardresearch.com/cs/24318560/beacon.js";
              el.parentNode.insertBefore(s, el);
            })();
          `,
        }}
      />
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<img src="https://sb.scorecardresearch.com/p?c1=2&amp;c2=24318560&amp;cv=3.9.1&amp;cj=1">`,
        }}
      />
    </>
  )
}
