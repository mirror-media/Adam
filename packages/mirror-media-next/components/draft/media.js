const styles = {
  buttons: {
    marginBottom: 10,
    display: 'flex',
  },
  urlInputContainer: {
    marginBottom: 10,
  },
  urlInput: {
    fontFamily: "'Georgia', serif",
    marginRight: 10,
    padding: 3,
  },
  button: {
    marginTop: '10px',
    marginRight: '10px',
    cursor: 'pointer',
  },
  media: {
    width: '100%',
  },
}

const Audio = (props) => {
  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <audio controls src={props.src} style={styles.media} />
}

const Image = (props) => {
  return <img src={props.src} style={styles.media} alt={props.alt} />
}

const Video = (props) => {
  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <video controls src={props.src} style={styles.media} />
}

export const MediaBlock = (entity) => {
  const { src } = entity.getData()
  const type = entity.getType()

  let media
  if (type === 'audioLink') {
    media = <Audio src={src} />
  } else if (type === 'imageLink') {
    media = <Image src={src} alt="" />
  } else if (type === 'videoLink') {
    media = <Video src={src} />
  }

  return media
}
