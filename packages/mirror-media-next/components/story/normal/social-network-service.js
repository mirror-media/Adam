//TODO: change facebook page plugin `data-tabs` by different viewport breakpoint

import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'
import snsLine from '../../../public/images/sns-line.png'
import snsIG from '../../../public/images/sns-ig.png'
import snsYT from '../../../public/images/sns-yt.png'
import snsMM from '../../../public/images/sns-mm.png'
import FbPagePlugin from './fb-page-plugin'
const Wrapper = styled.section`
  margin-top: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
  flex-direction: column;
  ${({ theme }) => theme.breakpoint.xl} {
    flex-direction: row;
  }
`
const FbPagePluginSmall = styled(FbPagePlugin)`
  height: 71px;
  width: 180px;
`

const SnsNav = styled.nav`
  ul {
    display: flex;
    flex-wrap: wrap;
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

export default function SocialNetworkService() {
  return (
    <Wrapper>
      <FbPagePluginSmall
        facebookPagePluginSetting={{
          'data-tabs': 'events',
          'data-small-header': 'true',
          'data-width': '180',
        }}
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
