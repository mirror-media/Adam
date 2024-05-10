import styled from 'styled-components'
import PrimaryButtonLoadingEffect from './primary-button-loading-effect'

const Button = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  background: #054f77;
  color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
  text-align: center;

  &:active,
  &:hover {
    background: #9cb7c6;
    color: #000;
  }

  &[disabled] {
    background: #e3e3e3;
    color: rgba(0, 0, 0, 0.3);
    box-shadow: none;
    cursor: not-allowed;
  }
`

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - 按鈕顯示內容
 * @param {boolean} [props.isLoading] - 控制按鈕是否顯示 Loading 效果
 * @param {boolean} [props.disabled] - 是否禁止點擊行為
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} props.onClick - 處理按鈕 click 事件
 */
export default function PrimaryButton({
  children,
  isLoading = false,
  disabled,
  onClick,
}) {
  return (
    <Button type="button" onClick={onClick} disabled={disabled}>
      {isLoading && disabled !== true ? (
        <PrimaryButtonLoadingEffect />
      ) : (
        children
      )}
    </Button>
  )
}
