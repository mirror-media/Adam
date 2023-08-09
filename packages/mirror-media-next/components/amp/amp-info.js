import styled from 'styled-components'
import { transformTimeDataIntoDotFormat } from '../../utils'
import { color } from '../../styles/theme/color'

const Section = styled.div`
  font-weight: 400;
  font-size: 18px;
  line-height: 25px;
  text-align: center;
`

const Title = styled.h1`
  margin: 4px 20px 12px 20px;
  font-size: 24px;
  line-height: 34px;
  text-align: center;
  color: rgba(0, 0, 0, 0.87);
`

const DateRow = styled.p`
  text-align: center;
  font-size: 14px;
  line-height: 14px;
  color: rgba(0, 0, 0, 0.5);
  padding-top: 8px;
  span + span {
    margin-left: 8px;
  }
`

/**
 * @param {Object} props
 * @property {Section} section
 * @property {string} title - post title
 * @property {string} publishedDate - post published date
 * @property {string} updatedAt - post updated date
 * @returns {JSX.Element}
 */
export default function AmpInfo({
  title = '',
  section = {},
  publishedDate = '',
  updatedAt = '',
}) {
  const publishedTaipeiTime = transformTimeDataIntoDotFormat(publishedDate)
  const updatedTaipeiTime = transformTimeDataIntoDotFormat(updatedAt)

  let sectionColor
  if (section) sectionColor = color.sectionsColor[section.slug]

  return (
    <section>
      <Section style={{ color: sectionColor || '#000' }}>
        {section?.name || ''}
      </Section>
      <Title>{title}</Title>
      <DateRow>
        <span>發佈時間</span>
        <span>{publishedTaipeiTime} 臺北時間</span>
      </DateRow>
      <DateRow>
        <span>更新時間</span>
        <span>{updatedTaipeiTime} 臺北時間</span>
      </DateRow>
    </section>
  )
}
