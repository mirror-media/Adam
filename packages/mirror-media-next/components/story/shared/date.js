import styled from 'styled-components'
import { transformTimeDataIntoDotFormat } from '../../../utils'

const DateText = styled.p`
  width: fit-content;
  height: auto;
  font-size: 14px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.5);

  ${({ theme }) => theme.breakpoint.md} {
    line-height: 1.8;
  }
`
/**
 * Component for render article publish or update time.
 * It will render formatted time by using  utils function `transformTimeDataIntoDotFormat`.
 * This component is currently using at story page wide and premium layout.
 * @component
 * @example
 * // Render a Date component with publishedDate time type and formatted time.
 * <Date timeData="2023-05-17T16:00:00.000Z" timeType="publishedDate" />
 *
 *
 * @param {Object} props
 * @param {string} props.timeData  - The time data to be formatted.
 * @param {'publishedDate' | 'updatedDate'} [props.timeType = 'publishedDate'] - The type of time data ('publishedDate' or 'updatedDate').
 * @param {string} [props.className] - Attribute for updating style by styled-component
 * @returns {JSX.Element}
 */
export default function Date({
  timeData = '',
  timeType = 'publishedDate',
  className = '',
}) {
  const formattedTime = transformTimeDataIntoDotFormat(timeData)
  return (
    <DateText className={className}>
      {timeType === 'publishedDate' ? '發布時間 ' : '更新時間 '}
      {formattedTime} 臺北時間
    </DateText>
  )
}
