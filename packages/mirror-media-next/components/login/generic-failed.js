import styled from 'styled-components'
import FormWrapper from '../shared/form-wrapper'
import StyledLink from './styled-link'
import DefaultButton from '../shared/buttons/default-button'

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PrimayText = styled.p`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
`

const SecondaryText = styled.p`
  color: rgba(0, 0, 0, 0.5);
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin-top: 16px;
  margin-bottom: 32px;
`

/**
 * @param {Object} props
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} props.onBack
 */
export default function GenericFailed({ onBack }) {
  return (
    <Main>
      <FormWrapper>
        <PrimayText>
          抱歉，出了點狀況...
          <br />
          請回上一頁重試
        </PrimayText>
        <SecondaryText>
          或是聯繫客服信箱{' '}
          <StyledLink href="mailto:mm-onlineservice@mirrormedia.mg">
            mm-onlineservice@mirrormedia.mg
          </StyledLink>{' '}
          / 致電 (02)6633-3966 由專人為您服務。
        </SecondaryText>
        <DefaultButton onClick={onBack}>回上一步</DefaultButton>
      </FormWrapper>
    </Main>
  )
}
