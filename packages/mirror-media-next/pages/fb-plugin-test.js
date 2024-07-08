import CustomFbPagePlugin from '../components/story/normal/fb-page-plugin'
import { ENV } from '../config/index.mjs'

export default function () {
  if (ENV !== 'dev' && ENV !== 'local') {
    return { notFound: true }
  }
  let facebookPagePluginSetting = {
    'data-tabs': 'events',
    'data-small-header': true,
    'data-width': 180,
    'data-height': 71,
  }
  let facebookPagePluginSize = {
    width: '180px',
    height: '71px',
  }
  return (
    <CustomFbPagePlugin
      facebookPagePluginSetting={facebookPagePluginSetting}
      facebookPagePluginSize={facebookPagePluginSize}
    />
  )
}
