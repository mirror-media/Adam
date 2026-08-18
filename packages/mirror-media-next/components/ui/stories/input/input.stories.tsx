import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Input } from '../../input'
import { Label } from '../../label'

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    disabled: {
      control: 'boolean',
    },
    hasError: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-mm-s">
      <Label htmlFor="input-default-story">搜尋關鍵字</Label>
      <Input id="input-default-story" placeholder="請輸入關鍵字" />
    </div>
  ),
}

export const Filled: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-mm-s">
      <Label htmlFor="input-filled-story">搜尋關鍵字</Label>
      <Input defaultValue="已輸入的搜尋字串" id="input-filled-story" />
    </div>
  ),
}

export const Error: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-mm-s">
      <Label htmlFor="input-error-story">搜尋關鍵字</Label>
      <Input defaultValue="錯誤狀態" hasError id="input-error-story" />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-mm-s">
      <Label htmlFor="input-disabled-story">搜尋關鍵字</Label>
      <Input disabled id="input-disabled-story" placeholder="Disabled" />
    </div>
  ),
}

export const Types: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-mm-l">
      <div className="grid gap-mm-s">
        <Label htmlFor="input-types-text-story">文字輸入</Label>
        <Input id="input-types-text-story" placeholder="文字輸入" type="text" />
      </div>
      <div className="grid gap-mm-s">
        <Label htmlFor="input-types-email-story">電子信箱</Label>
        <Input
          id="input-types-email-story"
          placeholder="email@example.com"
          type="email"
        />
      </div>
      <div className="grid gap-mm-s">
        <Label htmlFor="input-types-password-story">密碼</Label>
        <Input
          id="input-types-password-story"
          placeholder="請輸入密碼"
          type="password"
        />
      </div>
      <div className="grid gap-mm-s">
        <Label htmlFor="input-types-search-story">搜尋文章</Label>
        <Input
          id="input-types-search-story"
          placeholder="搜尋文章"
          type="search"
        />
      </div>
      <div className="grid gap-mm-s">
        <Label htmlFor="input-types-number-story">數字</Label>
        <Input id="input-types-number-story" placeholder="123" type="number" />
      </div>
      <div className="grid gap-mm-s">
        <Label htmlFor="input-types-tel-story">電話</Label>
        <Input
          id="input-types-tel-story"
          placeholder="0912-345-678"
          type="tel"
        />
      </div>
      <div className="grid gap-mm-s">
        <Label htmlFor="input-types-url-story">網址</Label>
        <Input
          id="input-types-url-story"
          placeholder="https://www.mirrormedia.mg"
          type="url"
        />
      </div>
    </div>
  ),
}
