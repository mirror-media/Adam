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
    className: 'h-5 w-[160px]',
  },
}

export const TextBlock: Story = {
  render: () => (
    <div className="grid w-full max-w-[360px] gap-mm-s">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-[88%]" />
      <Skeleton className="h-5 w-[64%]" />
    </div>
  ),
}

export const ArticleCard: Story = {
  render: () => (
    <div className="grid w-full max-w-[320px] gap-mm-m">
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="grid gap-mm-s">
        <Skeleton className="h-4 w-[72px] rounded-mm-full" />
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
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-4 w-[180px]" />
      </div>
    </div>
  ),
}
