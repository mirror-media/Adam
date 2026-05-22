import AvividScript from './ads/avivid/avivid-script'
import GPTScript from './ads/gpt/gpt-script'
import { useDisplayAd } from '../hooks/useDisplayAd'
import ComScoreScript from './comscore-script'
export default function WholeSiteScript() {
  const { shouldShowAd } = useDisplayAd()
  return (
    <>
      {shouldShowAd && <GPTScript />}
      {shouldShowAd && <AvividScript />}
      <ComScoreScript />
    </>
  )
}
