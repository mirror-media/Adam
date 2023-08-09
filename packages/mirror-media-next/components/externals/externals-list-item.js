import styled from 'styled-components'
import Image from '@readr-media/react-image'
import {
  getExternalPartnerColor,
  getExternalSectionTitle,
} from '../../utils/external'

/**
 * @typedef {import('../../type/theme').Theme} Theme
 */

const ItemWrapper = styled.a`
  display: block;
  position: relative;
  width: 100%;
  margin: 0 auto;
  font-size: 18px;
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 214px;

  ${({ theme }) => theme.breakpoint.xl} {
    height: 147px;
  }
`

const ItemDetail = styled.div`
  margin: 20px 20px 36px 20px;
  ${({ theme }) => theme.breakpoint.md} {
    margin: 20px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 8px 8px 40px 8px;
  }
`

const ItemTitle = styled.div`
  color: #054f77;
  line-height: 25px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${({ theme }) => theme.breakpoint.md} {
    height: 75px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 18px;
  }
`

const ItemBrief = styled.div`
  font-size: 16px;
  color: #979797;
  margin-top: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 16px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 20px;
    -webkit-line-clamp: 4;
  }
`

const ItemSection = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 8px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 300;
  background-color: ${
    /**
     * @param {Object} props
     * @param {string | undefined} props.partnerColor
     */ ({ partnerColor }) => partnerColor || 'black'
  };

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
    font-weight: 600;
    padding: 4px 20px;
  }
`

/**
 * @typedef {import('../../apollo/fragments/external').ListingExternal} ListingExternal
 */
/**
 * @param {Object} props
 * @param {ListingExternal} props.item
 * @returns {React.ReactElement}
 */
export default function ExternalListItem({ item }) {
  const { thumb = '', slug = '', title = '', brief = '', partner = null } = item

  const IMAGES_URL = { original: thumb }

  const partnerColor = getExternalPartnerColor(partner)
  const partnerSectionTitle = getExternalSectionTitle(partner)

  return (
    <ItemWrapper href={`/external/${slug}`} target="_blank">
      <ImageContainer>
        <Image
          images={IMAGES_URL}
          alt={title}
          loadingImage="/images/loading.gif"
          defaultImage="/images/default-og-img.png"
          rwd={{ tablet: '320px', desktop: '220px' }}
        />
        {partner && (
          <ItemSection partnerColor={partnerColor}>
            {partnerSectionTitle}
          </ItemSection>
        )}
      </ImageContainer>
      <ItemDetail>
        <ItemTitle>{title}</ItemTitle>
        <ItemBrief>{brief}</ItemBrief>
      </ItemDetail>
    </ItemWrapper>
  )
}
