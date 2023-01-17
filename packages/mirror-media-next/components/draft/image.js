import styled from 'styled-components'

const styles = {
  image: {
    width: '100%',
    margin: '0 auto',
  },
}

const Figcaption = styled.figcaption`
  margin-top: 8px;
  font-size: 14px;
  line-height: 22.4px;
  letter-spacing: 0.08em;
  color: #333333;
  ${({ theme }) => theme.breakpoint.md} {
    font-size: 14px;
    line-height: 22.4px;
  }
  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
    line-height: 25.6px;
  }
  a {
    color: rgba(225, 75, 0, 1);
    &:hover {
      text-decoration: underline;
    }
  }
`

export function ImageBlock(entity) {
  const { desc, imageFile, resized } = entity.getData()
  return (
    <figure>
      <img
        style={styles.image}
        src={resized?.original}
        onError={(e) => (e.currentTarget.src = imageFile?.url)}
        alt=""
      />
      <Figcaption dangerouslySetInnerHTML={{ __html: desc }}></Figcaption>
    </figure>
  )
}
