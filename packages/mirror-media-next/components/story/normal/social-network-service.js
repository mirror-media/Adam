//TODO: change facebook page plugin `data-tabs` by different viewport breakpoint

import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'
import snsLine from '../../../public/images/sns-line.png'
import snsIG from '../../../public/images/sns-ig.png'
import snsYT from '../../../public/images/sns-yt.png'
import snsMM from '../../../public/images/sns-mm.png'
import FbPagePlugin from './fb-page-plugin'

/**
 * @typedef {import('./fb-page-plugin').FacebookPagePluginSetting} FacebookPagePluginSetting
 */

/**
 * @typedef {'row' | 'column'} FlexDirection
 */

const Wrapper = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
  flex-direction: ${
    /**
     * @param {Object} params
     * @param {FlexDirection} params.flexDirection
     */
    ({ flexDirection }) => flexDirection
  };
`
const CustomFbPagePlugin = styled(FbPagePlugin)`
  height: ${
    /**
     * @param {Object} param
     * @param {{width: string, height: string}} param.facebookPagePluginSize
     */
    ({ facebookPagePluginSize }) => facebookPagePluginSize.height
  };
  width: ${({ facebookPagePluginSize }) => facebookPagePluginSize.width};
`

const SnsNav = styled.nav`
  ul {
    display: flex;
    flex-wrap: no-wrap;
    gap: 16px;
  }
`

const SNS_ITEM_LIST = [
  {
    name: 'line',
    href: 'https://lin.ee/dkD1s4q',
    image: { src: snsLine, alt: 'link to line' },
    buttonDesc: '加入',
  },
  {
    name: 'instagram',
    href: 'https://www.instagram.com/mirror_media/',
    image: { src: snsIG, alt: 'link to instagram' },
    buttonDesc: '追蹤',
  },
  {
    name: 'youtube',
    href: 'https://www.youtube.com/channel/UCYkldEK001GxR884OZMFnRw?sub_confirmation=1',
    image: { src: snsYT, alt: 'link to youtube' },
    buttonDesc: '訂閱',
  },
  {
    name: 'mirror app',
    href: 'https://www.mirrormedia.mg/story/20161228corpmkt001/?utm_source=magzine&utm_campaign=mm_app_download&utm_medium=qrcode',
    image: { src: snsMM, alt: 'link to mirror app' },
    buttonDesc: '下載',
  },
]

const SnsItem = styled.li`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.375;
  color: rgba(74, 74, 74, 1);
  a {
    display: flex;
    gap: 8px;
  }
  button {
    &:focus {
      outline: none;
    }
  }
  &.join-member-link {
    position: relative;
    padding-left: 12px;
    margin: 5px 0;
    color: ${({ theme }) => theme.color.brandColor.darkBlue};
    &::before {
      position: absolute;
      content: '';
      top: 50%;
      left: 0;
      width: 1px;
      transform: translateY(-50%);
      background-color: rgba(161, 161, 161, 1);
      height: 16px;
    }
  }
`

const snsItem = SNS_ITEM_LIST.map((item) => (
  <SnsItem key={item.name}>
    <Link href={item.href} target="_blank" rel="noreferrer noopener">
      <Image
        src={item.image.src}
        width="32"
        height="32"
        alt={item.image.alt}
      ></Image>
      <button>{item.buttonDesc}</button>
    </Link>
  </SnsItem>
))

/**
 * @param {Object} props
 * @param {boolean} [props.shouldShowLargePagePlugin] - Rather should show large facebook page plugin. It will change the appearance of plugin.
 * @param {'row' | 'column'} [props.flexDirection] - value of css property `flex-direction`. It will change direction of arrangement of this component.
 * @param {string} [props.className] - Attribute for updating style by styled-component
 * @returns {JSX.Element}
 */
export default function SocialNetworkService({
  shouldShowLargePagePlugin = false,
  flexDirection = 'row',
  className = '',
}) {
  /**
   * @type {FacebookPagePluginSetting}
   */
  let facebookPagePluginSetting = {
    'data-tabs': 'events',
    'data-small-header': true,
    'data-width': 180,
  }
  let facebookPagePluginSize = {
    width: '180px',
    height: '71px',
  }
  if (shouldShowLargePagePlugin) {
    facebookPagePluginSetting = {
      'data-tabs': 'timeline',
      'data-small-header': false,
    }
    facebookPagePluginSize = {
      width: '100%',
      height: '100%',
    }
  }
  return (
    <Wrapper flexDirection={flexDirection} className={className}>
      <CustomFbPagePlugin
        facebookPagePluginSetting={facebookPagePluginSetting}
        facebookPagePluginSize={facebookPagePluginSize}
      />
      <SnsNav>
        <ul>
          {snsItem}
          <SnsItem className="join-member-link">
            <Link href="/login" target="_blank" rel="noreferrer noopener">
              <button>加入會員</button>
            </Link>
          </SnsItem>
        </ul>
      </SnsNav>
    </Wrapper>
  )
}
