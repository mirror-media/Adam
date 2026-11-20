import { ENV } from '@/config/index.mjs'

const electionDevUrl =
  'https://dev.mirrormedia.mg/projects/election2026-homepage/index.html'
// Staging shares the prod build of the election page.
const electionProdUrl =
  'https://www.mirrormedia.mg/projects/election2026-homepage/index.html'

type HomepageElectionIframeProps = {
  isElectionPeriod: boolean
  isElectionTestPeriod: boolean
}

function HomepageElectionIframe({
  isElectionPeriod,
  isElectionTestPeriod,
}: HomepageElectionIframeProps) {
  const src =
    ENV === 'prod' || ENV === 'staging' ? electionProdUrl : electionDevUrl
  if (!isElectionPeriod) return null

  return (
    <div className="relative z-20 mt-3 -mb-10.75 md:mt-5 md:-mb-8.75 xl:-mb-5 [&:not(:has(+[data-homepage-ad]))]:mb-mm-5xl">
      <div className="relative mx-auto w-[320px] max-w-full md:w-[720px] xl:w-[970px]">
        <iframe
          className="block h-[330px] w-full border-0 md:h-[200px] xl:h-[294px]"
          src={src}
          title="2026 選舉開票"
          scrolling="no"
        />
        {isElectionTestPeriod && (
          <p className="pointer-events-none absolute right-4 bottom-3 text-[13px] leading-4.5 text-red-500 md:right-6">
            測試畫面
          </p>
        )}
      </div>
    </div>
  )
}

export { HomepageElectionIframe }
