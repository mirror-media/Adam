import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Z_INDEX } from '../../constants'

const CustomDropdownContainer = styled.div`
  position: relative;
`

const DropdownButton = styled.button`
  display: flex;
  width: 184px;
  height: 28px;
  color: rgba(0, 0, 0, 0.87);
  font-size: 14px;
  font-weight: 500;
  line-height: 200%; /* 28px */
  padding-left: 8px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #808080;
  cursor: pointer;

  :focus {
    outline: 0;
  }

  ::before {
    content: '';
    position: absolute;

    border: solid black;
    border-radius: 1.5px;
    border-width: 0 1.5px 1.5px 0;
    display: inline-block;
    transform: rotate(45deg);
    top: 8px;
    right: 8px;
    width: 9px;
    height: 9px;

    ${({
      // @ts-ignore
      isOpen,
    }) => (isOpen ? 'transform: rotate(-135deg); top:50% ' : '')}
  }

  ::after {
    content: '';
    position: absolute;
    top: 100%;
    transform: translateY(-50%);
    right: 8px;
    width: 168px;
    height: 1px;
    background-color: transparent;

    ${({
      // @ts-ignore
      isOpen,
    }) => (isOpen ? 'background-color: #b8b8b8;' : '')}
  }

  /* Set top border to none and adjust border radius when isOpen is true */
  ${({
    // @ts-ignore
    isOpen,
  }) =>
    isOpen
      ? `
      border-bottom: none;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    `
      : ''}
`
const OptionsList = styled.ul`
  position: absolute;
  color: rgba(0, 0, 0, 0.87);
  top: 100%;
  left: 0;
  width: 100%;
  list-style: none;
  overflow: hidden;
  z-index: ${Z_INDEX.coverContent}; /* Ensure the options list appears above other content */
  border-radius: 4px;
  border: 1px solid #808080;
  background: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 200%;

  /* Set top border to none */
  border-top: none;
  /* Set top border radius to none */
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`

const Option = styled.li`
  padding: 4px 8px;
  cursor: pointer;

  &:hover {
    background-color: #f7f7f7;
  }
`

export default function Dropdown({ authors, displayPodcastsByAuthor }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)

  const containerRef = useRef(null)

  const toggleDropdown = (e) => {
    e.preventDefault()
    setIsOpen(!isOpen)
  }

  const selectOption = (option) => {
    setSelectedOption(option)
    setIsOpen(false)
    handleAuthorSelect(option)
  }

  const handleOutsideClick = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  const handleAuthorSelect = (selectedAuthor) => {
    displayPodcastsByAuthor(selectedAuthor)
  }
  return (
    <CustomDropdownContainer ref={containerRef}>
      <DropdownButton
        // @ts-ignore
        isOpen={isOpen}
        onClick={toggleDropdown}
      >
        {selectedOption ? selectedOption : '全部'}
      </DropdownButton>
      {isOpen && (
        <OptionsList>
          {authors.map((option, index) => (
            <Option key={index} onClick={() => selectOption(option)}>
              {option}
            </Option>
          ))}
        </OptionsList>
      )}
    </CustomDropdownContainer>
  )
}
