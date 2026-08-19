import type { ComponentProps } from 'react'
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from '../../button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../dialog'

type DialogStoryArgs = ComponentProps<typeof Dialog> & {
  closeLabel: string
  showCloseButton: boolean
}

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    closeLabel: {
      control: 'text',
      description: '關閉按鈕的 accessible name，icon-only 控制項必須提供。',
    },
    disablePointerDismissal: {
      control: 'boolean',
      description: '關閉「點擊背景即關閉」的行為。',
    },
    modal: {
      control: 'inline-radio',
      description: 'trap-focus 只鎖焦點，不鎖背景捲動。',
      options: [false, true, 'trap-focus'],
    },
    showCloseButton: {
      control: 'boolean',
      description: '隱藏預設關閉按鈕時，內容必須自行提供 DialogClose。',
    },
  },
} satisfies Meta<DialogStoryArgs>

export default meta

type Story = StoryObj<DialogStoryArgs>

export const Default: Story = {
  args: {
    closeLabel: '關閉對話框',
    disablePointerDismissal: false,
    modal: true,
    showCloseButton: true,
  },
  render: ({ closeLabel, showCloseButton, ...rootProps }) => (
    <Dialog {...rootProps}>
      <DialogTrigger render={<Button variant="outline" />}>
        開啟對話框
      </DialogTrigger>
      <DialogContent closeLabel={closeLabel} showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>確認操作</DialogTitle>
          <DialogDescription>
            對話框開啟後，焦點與背景互動由 Base UI 的 modal contract 管理。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>取消</DialogClose>
          <Button>確認</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

function ControlledDialog() {
  const [open, setOpen] = useState(false)

  return (
    <div className="grid gap-mm-xl">
      <p className="font-mm-sans text-mm-body2">
        目前狀態：{open ? '開啟' : '關閉'}
      </p>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger render={<Button variant="outline" />}>
          開啟受控對話框
        </DialogTrigger>
        <DialogContent closeLabel="關閉受控對話框">
          <DialogHeader>
            <DialogTitle>受控狀態</DialogTitle>
            <DialogDescription>
              Consumer 可透過 open 與 onOpenChange 管理狀態。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>完成</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDialog />,
}

export const CustomClose: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        使用自訂關閉按鈕
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>自訂關閉控制項</DialogTitle>
          <DialogDescription>
            隱藏預設關閉按鈕時，內容仍必須提供可操作的 DialogClose。
          </DialogDescription>
        </DialogHeader>
        <DialogClose render={<Button />}>我知道了</DialogClose>
      </DialogContent>
    </Dialog>
  ),
}

export const LongScrollableContent: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        開啟長內容
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>長內容對話框</DialogTitle>
          <DialogDescription>
            內容超過可用高度時由對話框內部捲動，關閉控制項仍可操作。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-mm-xl">
          {Array.from({ length: 12 }, (_, index) => (
            <p key={index}>
              第 {index + 1} 段測試內容，用來驗證小尺寸畫面的捲動行為。
            </p>
          ))}
        </div>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
}
