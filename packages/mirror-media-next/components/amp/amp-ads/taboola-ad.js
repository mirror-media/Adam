import styled from 'styled-components'

const Title = styled.h2`
  font-weight: 600;
  font-size: 21px;
  line-height: 150%;
  color: #888;
  margin: 24px 0;
  text-align: center;
`
/**
 * Renders a Taboola component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title to display.
 * @return {JSX.Element} The rendered Taboola component.
 */

export default function Taboola({ title }) {
  return (
    <>
      <div id="taboola">
        <Title>{title}</Title>
        <div>
          {/* @ts-ignore */}
          <amp-embed
            width="100"
            height="100"
            type="taboola"
            layout="responsive"
            data-publisher="salesfrontier-mirromediaamp"
            data-mode="alternating-thumbnails-a-amp"
            data-placement="Below Article Thumbnails AMP"
            data-target_type="mix"
            data-article="auto"
            data-url=""
          />
        </div>
      </div>
    </>
  )
}
