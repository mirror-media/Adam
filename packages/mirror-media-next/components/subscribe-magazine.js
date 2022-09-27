import styled from 'styled-components'
import { minWidth } from '../styles/media'

const SubscribeMagazineButton = styled.button`
  display: none;
  @media ${minWidth.xl} {
    display: block;
    width: 141px;
    background-color: rgba(0, 0, 0, 1);
    color: white;
    text-align: center;
  }
`

export default function SubscribeMagazine() {
  return <SubscribeMagazineButton>鏡週刊雜誌訂閱</SubscribeMagazineButton>
}
