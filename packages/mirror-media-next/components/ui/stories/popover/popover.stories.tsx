import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from '../../button'
import {
  Popover,
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
} from '../../popover'

type PopoverStoryArgs = ComponentProps<typeof Popover> & {
  align: 'start' | 'center' | 'end'
  side: 'top' | 'right' | 'bottom' | 'left'
  sideOffset: number
}

const meta = {
  title: 'UI/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'inline-radio',
      description: 'Positioner 的對齊方式。',
      options: ['start', 'center', 'end'],
    },
    modal: {
      control: 'inline-radio',
      description: '是否鎖定背景互動；trap-focus 只鎖焦點不鎖捲動。',
      options: [false, true, 'trap-focus'],
    },
    side: {
      control: 'inline-radio',
      description: 'Positioner 相對觸發元素的方向。',
      options: ['top', 'right', 'bottom', 'left'],
    },
    sideOffset: {
      control: { max: 32, min: 0, step: 4, type: 'range' },
    },
  },
} satisfies Meta<PopoverStoryArgs>

export default meta

type Story = StoryObj<PopoverStoryArgs>

export const Default: Story = {
  args: {
    align: 'start',
    modal: false,
    side: 'bottom',
    sideOffset: 8,
  },
  render: ({ align, side, sideOffset, ...rootProps }) => (
    <div className="flex min-h-100 items-center justify-center">
      <Popover {...rootProps}>
        <PopoverTrigger render={<Button variant="outline" />}>
          查看說明
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverPositioner align={align} side={side} sideOffset={sideOffset}>
            <PopoverPopup className="max-w-72">
              <h2 className="font-mm-sans text-mm-h5">彈出內容</h2>
              <p className="mt-mm-m font-mm-body text-mm-body2">
                適合放置補充資訊或網站導覽，不套用 action-menu 語意。
              </p>
            </PopoverPopup>
          </PopoverPositioner>
        </PopoverPortal>
      </Popover>
    </div>
  ),
}

export const LongContent: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger render={<Button />}>開啟長內容</PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner>
          <PopoverPopup className="max-h-72 max-w-80 overflow-y-auto">
            <h2 className="font-mm-sans text-mm-h5">較長的補充內容</h2>
            <p className="mt-mm-m font-mm-body text-mm-body2">
              Popover 保留一般文件與導覽語意，內容較長時由 consumer
              決定尺寸與捲動方式，不把 business data 固定進 primitive。
            </p>
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  ),
}
