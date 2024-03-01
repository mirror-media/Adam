/**
 * @typedef {'primary' | 'secondary'} ButtonType
 * @typedef {Function} HandleOnClick
 */

/**
 * @param {Object} props
 * @param {ButtonType} props.buttonType
 * @param {React.MouseEventHandler<HTMLButtonElement>} props.handleOnClick
 * @param {React.ReactNode} props.children
 */
export default function UiMembershipButton({
  buttonType,
  handleOnClick,
  children,
}) {
  return (
    <button onClick={handleOnClick}>
      {buttonType}
      {children}
    </button>
  )
}
