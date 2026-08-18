import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from '../../button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  type SheetSide,
  SheetTitle,
  SheetTrigger,
} from '../../sheet'

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>

export default meta

type Story = StoryObj<typeof meta>

function SheetExample({ side = 'right' }: { side?: SheetSide }) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        從 {side} 開啟
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>補充面板</SheetTitle>
          <SheetDescription>
            Generic Sheet 支援四個方向；shell 使用方向仍等待 D10 決策。
          </SheetDescription>
        </SheetHeader>
        <div className="px-mm-xl">面板內容</div>
        <SheetFooter>
          <SheetClose render={<Button variant="outline" />}>關閉</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export const Default: Story = {
  render: () => <SheetExample />,
}

export const FourSides: Story = {
  render: () => (
    <div className="flex flex-wrap gap-mm-m">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <SheetExample key={side} side={side} />
      ))}
    </div>
  ),
}

export const CustomClose: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        使用自訂關閉按鈕
      </SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>自訂關閉控制項</SheetTitle>
          <SheetDescription>
            隱藏預設按鈕時仍提供可鍵盤操作的 SheetClose。
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose render={<Button />}>完成</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const MobileLongContent: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        開啟行動版長內容
      </SheetTrigger>
      <SheetContent closeLabel="關閉行動版選單">
        <SheetHeader>
          <SheetTitle>長內容面板</SheetTitle>
          <SheetDescription>
            驗證 375px viewport、focus、Escape 與 scroll lock。
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-mm-xl px-mm-xl">
          {Array.from({ length: 18 }, (_, index) => (
            <p key={index}>第 {index + 1} 個可捲動內容區塊</p>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const Tablet: Story = {
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
  render: () => <SheetExample />,
}
