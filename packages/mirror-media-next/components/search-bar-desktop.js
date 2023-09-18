import React from 'react'
import styled from 'styled-components'
import searchButtonWeb from '../public/images-next/search-button-web.png'
import SearchBarInput from './search-bar-input'

const SearchBarWrapper = styled.section`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: flex;
  }
`

const SearchButton = styled.button`
  display: block;
  height: 18px;
  cursor: pointer;
  user-select: none;
  &:focus {
    border: none;
    outline: none;
  }
  path {
    fill: #054f77;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    width: 40px;
    height: 34px;
    background-size: 15px;
    cursor: pointer;
    user-select: none;
    background-image: url(${searchButtonWeb.src});
    background-color: #888;
    background-position: center;
    background-repeat: no-repeat;
    margin-left: 4px;
    transition: background-color 0.15s ease-out;
    &:hover {
      background-color: #074f77;
    }
  }
`

/**
 *
 * @param {Object} props
 * @param {string} props.searchTerms
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setSearchTerms
 * @param {Function} props.goSearch
 * @returns {React.ReactElement}
 */
export default function SearchBar({ searchTerms, setSearchTerms, goSearch }) {
  return (
    <SearchBarWrapper>
      <SearchBarInput
        value={searchTerms}
        onChange={(event) => {
          setSearchTerms(event.target.value)
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            goSearch()
          }
        }}
      />
      <SearchButton
        onClick={() => {
          goSearch()
        }}
      />
    </SearchBarWrapper>
  )
}
