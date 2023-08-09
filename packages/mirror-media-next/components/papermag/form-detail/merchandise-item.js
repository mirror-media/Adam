import styled from 'styled-components'
import { getNumberWithCommas } from '../../../utils'

const Wrapper = styled.div`
  margin: auto;
  margin-top: 24px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 0px;
  }
`
const Title = styled.h2`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-weight: 500;
`

const Table = styled.table`
  margin-top: 16px;
  width: 100%;
`
const Td = styled.td`
  color: rgba(0, 0, 0, 0.87);
  font-size: 18px;
  font-weight: 400;
  padding-right: 24px;
`
const Tr = styled.tr`
  color: rgba(0, 0, 0, 0.87);
  font-size: 18px;
  font-weight: 400;

  :not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  }
  .item-name {
    color: rgba(0, 0, 0, 0.5);
    max-width: 194px;
    min-width: 65px;
  }
  .quantity {
    width: 128px;
    text-align: center;
  }
  .price {
    width: 125px;
  }
`
const CountButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #054f77;
  color: #054f77;
  font-size: 24px;
  font-weight: 300;
  position: relative;
  :focus {
    outline: none;
  }
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;

  span {
    position: absolute;
    top: -5px;
    left: 8px;
  }

  &[disabled] {
    color: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 0, 0, 0.3);
    cursor: default;
  }
`

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export default function MerchandiseItem({ count, setCount, plan }) {
  const handleIncrement = (e) => {
    e.preventDefault()
    setCount(count + 1)
  }

  const handleDecrement = (e) => {
    e.preventDefault()

    if (count > 1) {
      setCount(count - 1)
    }
  }

  return (
    <Wrapper>
      <Title>訂購項目</Title>
      <Table>
        <tbody>
          <Tr>
            <Td>品名</Td>
            <Td className="quantity">數量</Td>
            <Td className="price">單價</Td>
          </Tr>
          <Tr style={{ height: '72px' }}>
            <Td className="item-name">
              {plan === 1 ? '一年鏡週刊 52 期' : '二年鏡週刊 104 期'}
            </Td>
            <Td className="quantity buttons-wrapper">
              <ButtonsWrapper>
                <CountButton onClick={handleDecrement} disabled={count === 1}>
                  <span>-</span>
                </CountButton>
                <p>{count}</p>
                <CountButton onClick={handleIncrement}>
                  <span>+</span>
                </CountButton>
              </ButtonsWrapper>
            </Td>
            <Td className="price">
              NT${' '}
              {plan === 1
                ? getNumberWithCommas(2880 * count)
                : getNumberWithCommas(5280 * count)}
            </Td>
          </Tr>
        </tbody>
      </Table>
    </Wrapper>
  )
}
