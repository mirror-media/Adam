import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Skeleton } from '../../skeleton'

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    className: 'h-5 w-40',
  },
}

export const TextBlock: Story = {
  render: () => (
    <div className="grid w-full max-w-90 gap-mm-s">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-[88%]" />
      <Skeleton className="h-5 w-[64%]" />
    </div>
  ),
}

export const ArticleCard: Story = {
  render: () => (
    <div className="grid w-full max-w-xs gap-mm-m">
      <Skeleton className="aspect-video w-full" />
      <div className="grid gap-mm-s">
        <Skeleton className="h-4 w-18 rounded-mm-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-[78%]" />
      </div>
    </div>
  ),
}

export const AvatarRow: Story = {
  render: () => (
    <div className="flex items-center gap-mm-m">
      <Skeleton className="size-10 rounded-mm-full" />
      <div className="grid gap-mm-s">
        <Skeleton className="h-4 w-30" />
        <Skeleton className="h-4 w-45" />
      </div>
    </div>
  ),
}
