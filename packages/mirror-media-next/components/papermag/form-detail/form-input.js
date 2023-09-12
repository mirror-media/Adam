import { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'

const shakeAnimation = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-6px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(6px);
  }
`

const InputWrapper = styled.div`
  margin-top: 24px;
  input {
    display: flex;
    height: 48px;
    width: 100%;
    padding: 12px;
    align-items: center;
    margin-top: 8px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    background: #fff;
    color: rgba(0, 0, 0, 0.87);
    font-size: 18px;
    font-weight: 400;

    :focus {
      outline: none;
      border: 1px solid rgba(0, 0, 0, 0.87);

      ::placeholder {
        font-size: 16px;
      }
    }

    ::placeholder {
      color: rgba(0, 0, 0, 0.3);
      font-size: 18px;
      font-weight: 400;
    }

    &[disabled] {
      background: #e3e3e3;
      border: 1px solid rgba(0, 0, 0, 0.1);
      color: rgba(0, 0, 0, 0.6);
      ::placeholder {
        color: #e3e3e3;
      }
    }

    :invalid[focused='true'] ~ span {
      display: block;
    }

    :invalid[focused='true'] {
      border: 1px solid #e51731;
      animation: ${shakeAnimation} 0.3s ease-in-out;
    }
  }

  span {
    color: #e51731;
    font-size: 14px;
    font-weight: 400;
    margin-top: 8px;
    margin-bottom: -16px;
    display: none;
  }

  label {
    color: rgba(0, 0, 0, 0.87);
    font-size: 18px;
    font-weight: 500;
  }

  p {
    color: rgba(0, 0, 0, 0.5);
    font-size: 14px;
    font-weight: 400;
    margin-top: 4px;
  }
`

export default function FormInput(props) {
  const [focused, setFocused] = useState(false)
  const { label, errorMessage, onChange, sameAsOrderer, ...inputProps } = props

  // Set focused to true if sameAsOrderer is true
  useEffect(() => {
    if (sameAsOrderer) {
      setFocused(true)
    }
  }, [sameAsOrderer])
  const handleFocus = () => {
    setFocused(true)
  }

  const handleInvalid = (event) => {
    event.preventDefault()
    setFocused(true) // Ensure the input is marked as focused to apply the invalid styling
  }

  return (
    <InputWrapper>
      <label>{label}</label>
      {label?.includes('地址') && (
        <p>
          請填完整郵遞區號和地址，如：114066 台北市內湖區堤頂大道一段 365 號 1
          樓
        </p>
      )}
      <input
        {...inputProps}
        onChange={onChange}
        onBlur={handleFocus}
        // eslint-disable-next-line react/no-unknown-property
        focused={focused.toString()}
        onInvalid={handleInvalid}
      />
      <span>{errorMessage}</span>
    </InputWrapper>
  )
}
