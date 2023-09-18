import styled from 'styled-components'

const RadioInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;

  input {
    width: 20px;
    height: 20px;
    margin-right: 8px;

    /* Hide the default radio appearance */
    appearance: none;
    -webkit-appearance: none;

    /* Custom radio styles */
    position: relative;
    border: 2px solid rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    background-color: transparent;
    cursor: pointer;
    transition: border 0.3s, box-shadow 0.3s;

    :hover {
      border: 2px solid rgba(0, 0, 0, 0.87);
      box-shadow: 0px 0px 0px 10px rgba(80, 80, 200, 0.07); /* Halo effect */
    }

    &:checked::before {
      content: '';
      display: inline-block;
      width: 24px;
      height: 24px;
      background-image: url('/images-next/radio-active.svg');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      position: absolute;
      top: -4px;
      left: -4px;
      /* Change the fill color when checked and hovered */
      filter: brightness(1.1);
    }
    /* Change the fill color when hovered */
    &:hover::before {
      filter: brightness(1.5);
    }
  }

  label {
    color: rgba(0, 0, 0, 0.87);
    font-size: 18px;
    font-weight: 400;
  }
`

const RadioInput = ({ value, checked, onChange, children }) => {
  return (
    <RadioInputContainer>
      <input type="radio" value={value} checked={checked} onChange={onChange} />
      <label>{children}</label>
    </RadioInputContainer>
  )
}

export default RadioInput
