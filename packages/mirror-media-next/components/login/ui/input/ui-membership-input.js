import styled from 'styled-components'
const Input = styled.input`
  border: 1px solid black;
`
/**
 * @param {React.ComponentProps<'input'> } props
 */
export default function UiMembershipInput({
  placeholder = 'email',
  type = 'text',
  onChange = () => {},
  className = '',
  value = '',
}) {
  return (
    <Input
      className={className}
      placeholder={placeholder}
      type={type}
      onChange={onChange}
      value={value}
    ></Input>
  )
}
