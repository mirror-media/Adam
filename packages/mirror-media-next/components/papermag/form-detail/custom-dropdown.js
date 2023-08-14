import { useState } from 'react'
import styled from 'styled-components'

const CustomDropdownContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  margin: 12px 0;
`

const DropdownButton = styled.button`
  width: 100%;
  display: flex;
  color: rgba(0, 0, 0, 0.6);
  font-size: 18px;
  font-weight: 400;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  background: #fff;
  cursor: pointer;

  :focus {
    outline: 0;
    border: 1px solid rgba(0, 0, 0, 0.87);
  }

  :hover {
    ::before {
      transform: translateY(calc(-50% + 2.7px));
      filter: brightness(1.5);
    }
  }

  ::before {
    content: '';
    position: absolute;
    top: 50%;
    right: 6px;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    background-image: url('/images/arrow-down.svg');
    background-size: cover;
    transition: transform 0.3s ease-in-out;
    ${({
      // @ts-ignore
      isOpen,
    }) => (isOpen ? 'transform: translateY(-50%) rotate(180deg);' : '')}
  }
`

const OptionsList = styled.ul`
  position: absolute;
  color: rgba(0, 0, 0, 0.6);
  font-size: 18px;
  font-weight: 400;
  top: 100%;
  left: 0;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  z-index: 999; /* Ensure the options list appears above other content */
`

const Option = styled.li`
  padding: 8px 12px;
  cursor: pointer;

  &:hover {
    background-color: #c5dae6;
  }
`

export default function CustomDropdown({ options, defaultText = '請選擇' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)

  const toggleDropdown = (e) => {
    e.preventDefault()
    setIsOpen(!isOpen)
  }

  const selectOption = (option) => {
    setSelectedOption(option)
    setIsOpen(false)
  }

  return (
    <CustomDropdownContainer>
      <DropdownButton
        // @ts-ignore
        isOpen={isOpen}
        onClick={toggleDropdown}
      >
        {selectedOption ? selectedOption : defaultText}
      </DropdownButton>
      {isOpen && (
        <OptionsList>
          {options.map((option, index) => (
            <Option key={index} onClick={() => selectOption(option)}>
              {option}
            </Option>
          ))}
        </OptionsList>
      )}
    </CustomDropdownContainer>
  )
}
