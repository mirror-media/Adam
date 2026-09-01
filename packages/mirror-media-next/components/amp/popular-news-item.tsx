import Image from '@readr-media/react-image'
import styled from 'styled-components'

import type { AsideListingPostWithOrderedSections } from '../../apollo/fragments/post'
import { color } from '../../styles/theme/color'

const LinkWrapper = styled.a`
  display: flex;
  img {
    min-width: 160px;
  }
`

const FigureCaption = styled.div`
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Label = styled.span<{ labelColor: string }>`
  display: flex;
  width: fit-content;
  height: fit-content;
  padding: 8px;
  text-align: center;
  color: white;
  font-size: 14px;
  font-weight: 300;
  background-color: ${({ labelColor }) => labelColor};
`

const Title = styled.h3`
  color: #4a4a4a;
  text-align: justify;
  font-family: 'PingFang TC';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`

type PopularNewsItemProps = {
  item: AsideListingPostWithOrderedSections
}

export default function PopularNewsItem({ item }: PopularNewsItemProps) {
  const firstSection = item.sectionsWithOrdered?.[0] || item.sections?.[0]
  const sectionSlug = firstSection?.slug
  const labelColor = color.getSectionLabelColor(sectionSlug)

  return (
    <LinkWrapper
      href={`/story/${item.slug}`}
      target="_blank"
      className="GTM-idle-window-click-popular-list"
    >
      <Image
        images={item?.heroImage?.resized}
        alt={item.title}
        loadingImage={'/images-next/loading.gif'}
        defaultImage={'/images-next/default-og-img.png'}
        width={160}
        height={106}
      />

      <FigureCaption>
        {sectionSlug ? (
          <Label labelColor={labelColor}>{firstSection.name}</Label>
        ) : (
          <div />
        )}
        <Title>{item.title}</Title>
      </FigureCaption>
    </LinkWrapper>
  )
}
