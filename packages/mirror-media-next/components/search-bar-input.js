import styled from 'styled-components'
import { maxWidth } from '../styles/media'

const SearchInputWrapper = styled.div`
  font-size: 16px;
  color: #1b1b1b;
  height: 34px;
  border: 0.5px solid rgba(0, 0, 0, 1);
  width: fit-content;
  @media ${maxWidth.xl} {
    height: 32px;
    margin-top: 16px;
  }
`

const SearchInput = styled.input`
  padding-left: 12px;
  padding-right: 12px;
  height: 100%;
  width: 100%;
  line-height: 34px;
  display: block;
  background-color: rgba(245, 245, 245, 1);
  &::placeholder {
    color: #888;
  }
  @media ${maxWidth.xl} {
    border-radius: 8px;
  }
`

export default function SearchBarInput({
  value,
  onChange,
  onKeyPress,
  className = '',
}) {
  return (
    <SearchInputWrapper className={className}>
      <SearchInput
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        type="text"
        placeholder="請輸入關鍵字"
      />
    </SearchInputWrapper>
  )
}
