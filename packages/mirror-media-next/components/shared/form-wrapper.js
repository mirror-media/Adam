// This component is for wrapping form in login and passord recovery pages
import styled from 'styled-components'

const FormWrapper = styled.div`
  min-width: 320px;
  max-width: 596px; // prevent content from exceeding the boundaries of header
  width: 100%;
  background-color: #fff;
  padding: 40px 20px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 40px 40px;
    margin-top: 48px;
    margin-bottom: 48px;
    border-radius: 24px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.08),
      0px 4px 28px 0px rgba(0, 0, 0, 0.06);
  }
`

export default FormWrapper
