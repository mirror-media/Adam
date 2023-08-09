import { useState, useRef } from 'react'
import styled from 'styled-components'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { mediaSize, minWidth } from '../../styles/media'
import searchButtonWeb from '../../public/images/search-button-web.png'
import SearchButtonMobileSVG from '../../public/images/search-button-mobile.svg'
import SearchBarInput from './search-bar-input'
import { Search_Icon_Width } from '../../styles/header'
import useClickOutside from '../../hooks/useClickOutside'

const SearchBarWrapper = styled.section`
  @media ${minWidth.xl} {
    display: flex;
  }
`

const SearchButton = styled.button`
  display: block;
  width: ${Search_Icon_Width};
  height: 18px;
  cursor: pointer;
  user-select: none;

  path {
    fill: white;
  }

  @media ${minWidth.xl} {
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

const SearchFieldWrapper = styled.div`
  background-color: #d8d8d8;
  top: 76px;
  padding: 16px 24px;
  width: 100%;
  position: absolute;
  left: 0;
  &::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 8px 16px 8px;
    border-color: transparent transparent #d8d8d8 transparent;
    position: absolute;
    top: -16px;
    right: calc(5vw);
    @media ${minWidth.md} {
      right: calc(5vw + 20px);
    }
  }
`

export default function SearchBar() {
  const [searchTerms, setSearchTerms] = useState('')
  const [showSearchField, setShowSearchField] = useState(false)
  const mobileSearchWrapperRef = useRef(null)
  useClickOutside(mobileSearchWrapperRef, () => {
    setShowSearchField(false)
  })
  const { width } = useWindowDimensions()
  const goSearch = () => {
    /*
      1. remove whitespace from both sides of a string
      2. remove whitespace from both sides of any comma
      3. replace whitespace bwtween two letters with a comma
     */
    const trimedSearchTerms = searchTerms
      .trim()
      .replace(/\s*,\s*/g, ',')
      .replace(/\s+/g, ',')

    if (trimedSearchTerms === '') return setSearchTerms('')
    location.assign(`/search/${trimedSearchTerms}`)
  }

  if (width < mediaSize.xl) {
    return (
      <SearchBarWrapper ref={mobileSearchWrapperRef}>
        <SearchButton
          onClick={() => {
            setShowSearchField((val) => !val)
          }}
        >
          <SearchButtonMobileSVG />
        </SearchButton>
        {showSearchField && (
          <SearchFieldWrapper>
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
          </SearchFieldWrapper>
        )}
      </SearchBarWrapper>
    )
  } else {
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
}
