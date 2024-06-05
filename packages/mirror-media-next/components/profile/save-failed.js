import FormWrapper from './form-wrapper'
import styled from 'styled-components'
import DefaultButton from '../shared/buttons/default-button'

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const PrimaryText = styled.p`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  line-height: 150%;
  font-weight: 500;
  font-style: normal;
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
 * @param {() => void} props.onReset
 */
export default function SaveFailed({ onReset }) {
  return (
    <Main>
      <FormWrapper>
        <PrimaryText>儲存失敗</PrimaryText>
        <SecondaryText>請稍候再操作</SecondaryText>
        <DefaultButton onClick={onReset}>回個人資料頁</DefaultButton>
      </FormWrapper>
    </Main>
  )
}
