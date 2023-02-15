import styled from 'styled-components'

/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

const Wrapper = styled.section`
  margin-top: 20px;
`
const Heading = styled.div`
  background-color: ${
    /**
     * @param {Object} props
     * @param {Theme} props.theme
     */
    ({ theme }) => theme.color.brandColor.darkBlue
  };
  border: 1px solid #dedede;
  color: #fff;
  padding: 8px 0 8px 20px;
`

const NewsWrapper = styled.ul`
  border: 1px solid #dedede;
  padding: 20.5px 20px;
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 21px;
`
const News = styled.li`
  width: 100%;
  margin: 0 auto;
  height: 80px;
  display: flex;
  flex-direction: ${
    /**
     * @param {Object} props
     * @param {boolean} props.shouldReverseOrder
     */
    ({ shouldReverseOrder }) => (shouldReverseOrder ? 'row-reverse' : 'row')
  };
  gap: 12px;
  img {
    width: 120px;
  }
`

const Label = styled.div`
  width: fit-content;
  height: 25px;
  padding: 0 8px;
  text-align: center;
  color: white;
  font-size: 14px;
  line-height: 25px;
  font-weight: 400;
  background-color: ${
    /**
     * @param {Object} props
     * @param {Theme} props.theme
     */
    ({ theme }) => theme.color.brandColor.lightBlue
  };
`
const Title = styled.p`
  margin-top: 8px;
  text-align: left;
  width: 100%;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: ${
    /**
     * @param {Object} props
     * @param {Theme} props.theme
     */
    ({ theme }) => theme.color.brandColor.darkBlue
  };

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`
/**
 *
 * @param {Object} props
 * @param {string} props.heading - heading of this components, showing user what kind of news is
 * @param {boolean} props.shouldReverseOrder
 * - control the css layout of news.
 * - If is true, image of news should display at right, content and label should display at left.
 * - If is false, image of news should display at left, content and label should display at right.
 * optional, default value is `false`.
 * @returns {JSX.Element}
 */
export default function AsideArticleList({
  heading = '',
  shouldReverseOrder = false,
}) {
  const newsJsx = (
    <>
      <News shouldReverseOrder={shouldReverseOrder}>
        <img src="/images/default-og-img.png" />

        <div>
          <Label>標籤標籤</Label>
          <Title>
            標題標題標題標題標題標題標題標題標題標題標題標題標題標題標題標題標題標題
          </Title>
        </div>
      </News>
      <News shouldReverseOrder={shouldReverseOrder}>
        <img src="/images/default-og-img.png" />

        <div>
          <Label>標籤標籤</Label>
          <Title>
            標題標題標題標題標題標題標題標題標題標題標題標題標題標題標題標題標題標題
          </Title>
        </div>
      </News>
    </>
  )

  return (
    <Wrapper>
      <Heading>{heading}</Heading>
      <NewsWrapper>{newsJsx}</NewsWrapper>
    </Wrapper>
  )
}
