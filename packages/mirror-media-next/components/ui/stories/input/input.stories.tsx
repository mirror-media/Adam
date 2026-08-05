import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Input } from '../../input'

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
  args: {
    placeholder: '請輸入關鍵字',
  },
}

export const Filled: Story = {
  args: {
    defaultValue: '已輸入的搜尋字串',
  },
}

export const Error: Story = {
  args: {
    defaultValue: '錯誤狀態',
    hasError: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled',
  },
}

export const Types: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-mm-l">
      <Input placeholder="文字輸入" type="text" />
      <Input placeholder="email@example.com" type="email" />
      <Input placeholder="請輸入密碼" type="password" />
      <Input placeholder="搜尋文章" type="search" />
    </div>
  ),
}
