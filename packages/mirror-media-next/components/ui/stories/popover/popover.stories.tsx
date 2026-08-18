import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from '../../button'
import {
  Popover,
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
} from '../../popover'

const meta = {
  title: 'UI/Popover',
  component: Popover,
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        查看說明
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner>
          <PopoverPopup className="max-w-72">
            <h2 className="font-mm-sans text-mm-h5">彈出內容</h2>
            <p className="mt-mm-m font-mm-body text-mm-body2">
              適合放置補充資訊或網站導覽，不套用 action-menu 語意。
            </p>
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
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
