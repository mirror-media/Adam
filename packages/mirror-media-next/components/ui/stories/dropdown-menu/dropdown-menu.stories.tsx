import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CircleUserRoundIcon } from 'lucide-react'

import { Button } from '../../button'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuPopup,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../dropdown-menu'

const meta = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="開啟會員選單"
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <CircleUserRoundIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuPositioner align="end">
          <DropdownMenuPopup>
            <DropdownMenuLinkItem href="/profile">
              個人資料
            </DropdownMenuLinkItem>
            <DropdownMenuLinkItem href="/profile/purchase">
              訂閱紀錄
            </DropdownMenuLinkItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-mm-error-600 data-highlighted:bg-mm-error-100 data-highlighted:text-mm-error-700">
              登出
            </DropdownMenuItem>
          </DropdownMenuPopup>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownMenu>
  ),
}

export const DisabledItem: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        開啟選單
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuPositioner>
          <DropdownMenuPopup>
            <DropdownMenuItem>可操作項目</DropdownMenuItem>
            <DropdownMenuItem disabled>停用項目</DropdownMenuItem>
          </DropdownMenuPopup>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownMenu>
  ),
}
