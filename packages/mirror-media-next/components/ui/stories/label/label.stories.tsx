import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Input } from '../../input'
import { Label } from '../../label'

const meta = {
  title: 'UI/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
    },
    htmlFor: {
      control: 'text',
      description: '必須對應受控欄位的 id，否則點擊標籤不會聚焦欄位。',
    },
  },
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: '搜尋關鍵字',
    htmlFor: 'label-default-story',
  },
  render: (args) => (
    <div className="grid w-full max-w-sm gap-mm-s">
      <Label {...args} />
      <Input id="label-default-story" placeholder="請輸入關鍵字" />
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-mm-s">
      <Label htmlFor="label-required-story">
        電子信箱
        <span aria-hidden="true" className="text-mm-error-500">
          *
        </span>
        <span className="sr-only">必填</span>
      </Label>
      <Input id="label-required-story" required type="email" />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="group grid w-full max-w-sm gap-mm-s" data-disabled="true">
      <Label htmlFor="label-disabled-story">停用欄位</Label>
      <Input disabled id="label-disabled-story" />
    </div>
  ),
}

export const WithDescriptionAndError: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-mm-s">
      <Label htmlFor="label-error-story">會員信箱</Label>
      <Input
        aria-describedby="label-description-story label-error-message-story"
        defaultValue="invalid-email"
        hasError
        id="label-error-story"
      />
      <p
        className="font-mm-sans text-mm-caption-s text-mm-neutral-600"
        id="label-description-story"
      >
        我們只會用這個信箱通知會員服務。
      </p>
      <p
        className="font-mm-sans text-mm-caption-s text-mm-error-500"
        id="label-error-message-story"
      >
        請輸入有效的電子信箱。
      </p>
    </div>
  ),
}
