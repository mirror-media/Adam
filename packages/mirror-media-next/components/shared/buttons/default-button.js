import styled from 'styled-components'
import DefaultButtonLoadingEffect from './default-button-loading-effect'

const Button = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 8px;

  &:active,
  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.87);
  }
`

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - 按鈕顯示內容
 * @param {boolean} [props.isLoading] - 控制按鈕是否顯示 Loading 效果
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} props.onClick - 處理按鈕 click 事件
 */
export default function DefaultButton({
  children,
  isLoading = false,
  onClick,
}) {
  return (
    <Button type="button" onClick={onClick}>
      {isLoading ? <DefaultButtonLoadingEffect /> : children}
    </Button>
  )
}
