import NextLink from 'next/link'
const style = { link: { textDecoration: 'underline' } }

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity()
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    )
  }, callback)
}

function Link(props) {
  const { url } = props.contentState.getEntity(props.entityKey).getData()
  return (
    <NextLink
      href={url}
      target="_blank"
      style={style.link}
      rel="noopener noreferrer"
    >
      {props.children}
    </NextLink>
  )
}

export const linkDecorator = {
  strategy: findLinkEntities,
  component: Link,
}
