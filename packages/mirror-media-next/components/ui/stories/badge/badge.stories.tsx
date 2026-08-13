import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Badge } from '../../badge'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'outline-muted', 'solid-base', 'solid-second'],
    },
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Outline: Story = {
  args: {
    children: '標籤標籤',
  },
}

export const OutlineMuted: Story = {
  args: {
    children: '標籤標籤',
    variant: 'outline-muted',
  },
}

export const SolidBase: Story = {
  args: {
    children: '政治社會',
    variant: 'solid-base',
  },
}

export const SolidSecond: Story = {
  args: {
    children: '延伸閱讀',
    variant: 'solid-second',
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-mm-m">
      <Badge>標籤標籤</Badge>
      <Badge variant="outline-muted">標籤標籤</Badge>
      <Badge variant="solid-base">政治社會</Badge>
      <Badge variant="solid-second">延伸閱讀</Badge>
    </div>
  ),
}

export const LongText: Story = {
  render: () => (
    <div className="max-w-xs">
      <Badge>這是一個很長的標籤名稱 Mirror Media</Badge>
    </div>
  ),
}
