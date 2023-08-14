import styled from 'styled-components'
import FormInput from './form-input'

const Wrapper = styled.div`
  width: 100%;
`
const Note = styled.p`
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
  font-weight: 400;
  margin-top: 8px;
  margin-bottom: -16px;
`
const Title = styled.h2`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-weight: 500;
`
const FormInputsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px; /* Safari 12+ */
    grid-gap: 16px; /* Safari 10-11 */
  }
`
const PhoneExtInputWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 80px; /* Divide the space: phone - dash - phoneExt */
  align-items: center;

  ${({ theme }) => theme.breakpoint.lg} {
    padding-right: 142px;
  }

  span {
    color: rgba(0, 0, 0, 0.87);
    font-size: 18px;
    font-weight: 400;
    margin: 0 12px;
    margin-top: 56px;
  }
`

export default function Orderer({ ordererValues, setOrdererValues }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    const newValues = { ...ordererValues, [name]: value }
    setOrdererValues(newValues)
  }

  return (
    <Wrapper>
      <Title>訂購人</Title>
      <Note>目前無提供國外海外地區的紙本雜誌訂閱及寄送服務。</Note>

      <FormInputsWrapper>
        <FormInput
          name="username"
          type="text"
          label="姓名"
          placeholder="訂購人姓名"
          value={ordererValues.username}
          onChange={handleChange}
          errorMessage="訂購人姓名不可空白"
          required
        />
        <FormInput
          name="cellphone"
          type="text"
          label="手機"
          placeholder="0912345678"
          value={ordererValues.cellphone}
          onChange={handleChange}
          errorMessage="請輸入有效的聯絡電話"
          required
          pattern="09[0-9]{8}" // Match "09" followed by exactly 8 more digits
        />
      </FormInputsWrapper>
      <PhoneExtInputWrapper>
        <FormInput
          name="phone"
          type="text"
          label="市話（非必填）"
          placeholder="023456789"
          value={ordererValues.phone}
          onChange={handleChange}
        />
        <span>-</span>
        <FormInput
          name="phoneExt"
          type="text"
          label="&nbsp;"
          placeholder="分機"
          value={ordererValues.phoneExt}
          onChange={handleChange}
          style={{ width: '80px' }}
        />
      </PhoneExtInputWrapper>
      <FormInput
        name="address"
        type="text"
        label="地址"
        placeholder="訂購人通訊地址"
        value={ordererValues.address}
        onChange={handleChange}
        errorMessage="地址不可空白"
        required
      />
      <FormInput
        name="email"
        type="email"
        label="電子信箱"
        placeholder="訂購人電子信箱"
        value={ordererValues.email}
        onChange={handleChange}
        errorMessage="請輸入有效的 Email 地址"
        required
      />
    </Wrapper>
  )
}
