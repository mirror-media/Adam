import styled from 'styled-components'

const CheckBoxWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  margin-bottom: -8px;

  input {
    width: 20px;
    height: 20px;
    color: rgba(0, 0, 0, 0.3);
    font-size: 20px;
    font-weight: 400;
    margin-right: 8px;

    /* Hide the default checkbox appearance */
    appearance: none;
    -webkit-appearance: none;

    /* Custom checkbox styles */
    position: relative;
    border: 2px solid rgba(0, 0, 0, 0.3);
    border-radius: 4px;
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
      width: 26px;
      height: 26px;
      background-image: url('/images/checkbox-active.svg');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      position: absolute;
      top: -5px;
      left: -5px;
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

const Checkbox = ({ checked, onChange, label }) => {
  return (
    <CheckBoxWrapper>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <label>{label}</label>
    </CheckBoxWrapper>
  )
}

export default Checkbox
