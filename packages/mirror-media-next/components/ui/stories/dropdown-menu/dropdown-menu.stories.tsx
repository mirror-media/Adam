import type { ComponentProps } from 'react'
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

type DropdownMenuStoryArgs = ComponentProps<typeof DropdownMenu> & {
  align: 'start' | 'center' | 'end'
  side: 'top' | 'right' | 'bottom' | 'left'
  sideOffset: number
}

const meta = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'inline-radio',
      description: 'Positioner 的對齊方式；會員選單靠右使用 end。',
      options: ['start', 'center', 'end'],
    },
    modal: {
      control: 'boolean',
      description: '是否鎖定背景互動。',
    },
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
    },
    sideOffset: {
      control: { max: 32, min: 0, step: 4, type: 'range' },
    },
  },
} satisfies Meta<DropdownMenuStoryArgs>

export default meta

type Story = StoryObj<DropdownMenuStoryArgs>

export const Default: Story = {
  args: {
    align: 'end',
    modal: true,
    side: 'bottom',
    sideOffset: 8,
  },
  render: ({ align, side, sideOffset, ...rootProps }) => (
    <div className="flex min-h-100 items-center justify-center">
      <DropdownMenu {...rootProps}>
        <DropdownMenuTrigger
          aria-label="開啟會員選單"
          render={<Button size="icon-sm" variant="ghost" />}
        >
          <CircleUserRoundIcon aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuPositioner
            align={align}
            side={side}
            sideOffset={sideOffset}
          >
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
    </div>
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
