import styled from 'styled-components'
import { useState, useRef } from 'react'
import useClickOutside from '../../hooks/useClickOutside'

const DropdownMenuWrapper = styled.div`
  position: relative;
`

/**
 * @typedef {Object} SelectBoxProps
 * @property {boolean} isOpen
 * @property {boolean} isSelected
 * @property {boolean} disabled
 */

/**
 * @type {import('styled-components').StyledComponent<"div", any, SelectBoxProps, never>}
 */
const SelectBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 18px;
  line-height: 150%;
  height: 48px;
  border: 1px solid
    ${
      /** @param {SelectBoxProps} props */
      (props) => (props.isOpen ? 'rgba(0, 0, 0, 0.87)' : 'rgba(0, 0, 0, 0.3)')
    };
  border-bottom: ${
    /** @param {SelectBoxProps} props */
    (props) => (props.isOpen ? 'none' : '1px solid rgba(0, 0, 0, 0.3)')
  };
  border-radius: ${
    /** @param {SelectBoxProps} props */
    (props) => (props.isOpen ? '8px 8px 0 0' : '8px')
  };
  color: ${
    /** @param {SelectBoxProps} props */
    (props) => (props.isSelected ? 'rgba(0, 0, 0, 0.87)' : 'rgba(0, 0, 0, 0.3)')
  };
  cursor: ${
    /** @param {SelectBoxProps} props */
    (props) => (props.disabled ? 'not-allowed' : 'pointer')
  };
  padding: 12px;

  ::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 14px;
    border: solid #054f77;
    border-width: 0 0 2px 2px;
    padding: 4px;
    transform-origin: 25% 75%;
    transform: translateY(-50%)
      ${(props) => (props.isOpen ? 'rotate(135deg);' : 'rotate(-45deg)')};
  }

  ::before {
    content: '';
    position: absolute;
    bottom: 0px;
    left: 12px;
    right: 12px;
    height: 1px;
    background-color: ${
      /** @param {SelectBoxProps} props */
      (props) => (props.isOpen ? 'rgba(0, 0, 0, 0.3)' : 'transparent')
    };
  }
`

/**
 * @typedef {Object} UlProps
 * @property {boolean} isOpen
 */

/**
 * @type {import('styled-components').StyledComponent<"ul", any, UlProps, never>}
 */
const Ul = styled.ul`
  display: ${
    /** @param {UlProps} props */
    (props) => (props.isOpen ? 'block' : 'none')
  };
  position: absolute;
  background-color: #fff;
  font-size: 18px;
  width: 100%;
  z-index: 100;
  border: 1px solid rgba(0, 0, 0, 0.87);
  border-top: none;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  overflow: hidden;
  max-height: 172px; // limit the visible items
  overflow-y: auto;
`
const Li = styled.li`
  padding: 8px 12px;
  :hover {
    cursor: pointer;
    color: #fff;
    background-color: #054f77;
  }
`

/**
 * @typedef {import('../../type/profile.js').Option} Option
 */

/**
 * @param {Object} props
 * @param {Option[]} props.options
 * @param {string} props.keyField
 * @param {string} props.value
 * @param {(value: string) => void} props.onSelect
 * @param {string} props.selectedOption
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.placeholder]
 * @returns {JSX.Element}
 */

export default function DropdownMenu({
  options,
  keyField,
  value,
  onSelect,
  selectedOption,
  disabled = false,
  placeholder = '請選擇',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useClickOutside(dropdownRef, () => {
    setIsOpen(false)
  })

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  const handleClickOption = (option) => {
    if (!disabled) {
      onSelect(option[value])
      setIsOpen(!isOpen)
    }
  }

  return (
    <DropdownMenuWrapper ref={dropdownRef}>
      <SelectBox
        isOpen={isOpen}
        isSelected={!!selectedOption}
        disabled={disabled}
        onClick={toggleDropdown}
      >
        {selectedOption ? selectedOption : placeholder}
      </SelectBox>

      <Ul isOpen={isOpen}>
        {options.map((option) => (
          <Li key={option[keyField]} onClick={() => handleClickOption(option)}>
            {option[value]}
          </Li>
        ))}
      </Ul>
    </DropdownMenuWrapper>
  )
}
