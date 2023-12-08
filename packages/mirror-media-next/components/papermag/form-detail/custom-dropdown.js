import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Z_INDEX } from '../../../constants'

const CustomDropdownContainer = styled.div`
  width: 100%;
  position: relative;
  margin-top: 12px;
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
    background-image: url('/images-next/arrow-down.svg');
    background-size: cover;
    transition: transform 0.3s ease-in-out;
    ${
      /**
       * @param {Object} param
       * @param {boolean} param.isOpen
       */ ({ isOpen }) =>
        isOpen ? 'transform: translateY(-50%) rotate(180deg);' : ''
    }
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
  z-index: ${Z_INDEX.coverContent}; /* Ensure the options list appears above other content */
`

const Option = styled.li`
  padding: 8px 12px;
  cursor: pointer;

  &:hover {
    background-color: #c5dae6;
  }
`

export default function CustomDropdown({
  options,
  defaultText = '請選擇',
  onSelect,
}) {
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

    // Call the callback with the selected option
    if (onSelect) {
      onSelect(option)
    }
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

  return (
    <CustomDropdownContainer ref={containerRef}>
      <DropdownButton isOpen={isOpen} onClick={toggleDropdown}>
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
