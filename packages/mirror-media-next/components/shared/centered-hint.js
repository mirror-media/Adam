import Hint from './hint'

/**
 * @param {import("./hint").HintProps} props
 */
export default function CenteredHint({ $state, children }) {
  return (
    <Hint $state={$state} style={{ textAlign: 'center', alignSelf: 'center' }}>
      {children}
    </Hint>
  )
}
