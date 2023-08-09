import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'
import { MAGAZINE_PLATFORM_LINKS } from '../../constants/magazine-platform-links'

const PlatformsList = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  ${({ theme }) => theme.breakpoint.md} {
    width: 540px;
    flex-direction: row;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 960px;
  }

  img {
    height: 48px;
    width: auto;
    margin-top: 32px;

    ${({ theme }) => theme.breakpoint.md} {
      margin-right: 32px;
      margin-top: 48px;
      &:not(:last-child) {
        margin-right: 0px;
      }
    }
  }
`

const KonoLinks = styled.div`
  margin: 8px 0 0 0;
  font-size: 16px;
  line-height: 150%;
  color: #4a4a4a;
  display: flex;
  justify-content: center;

  ${({ theme }) => theme.breakpoint.md} {
    justify-content: flex-end;
    width: 360px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 860px;
  }
`

/**
 * @returns {React.ReactElement}
 */

export default function MagazinePlatforms() {
  /**
   * @typedef {Object} PlatformItem
   * @property {string} name
   * @property {string} href
   * @property {string} svgIcon
   * @property {string} linkA
   * @property {string} linkB
   */

  /**
   * @type {PlatformItem[]}
   */

  return (
    <PlatformsList>
      {MAGAZINE_PLATFORM_LINKS.slice(0, 4).map((item) => (
        <Link
          key={item.name}
          href={item.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            width={48}
            height={48}
            src={item.svgIcon}
            alt={`購買動態雜誌平台_${item.name}`}
          />
        </Link>
      ))}
      <Image
        width={48}
        height={48}
        alt={`購買動態雜誌平台_${MAGAZINE_PLATFORM_LINKS[4].name}`}
        src={MAGAZINE_PLATFORM_LINKS[4].svgIcon}
      />
      <KonoLinks>
        <Link
          href={MAGAZINE_PLATFORM_LINKS[4].linkA}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>A本</span>
        </Link>
        <span>｜</span>
        <Link
          href={MAGAZINE_PLATFORM_LINKS[4].linkB}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>B本</span>
        </Link>
      </KonoLinks>
    </PlatformsList>
  )
}
