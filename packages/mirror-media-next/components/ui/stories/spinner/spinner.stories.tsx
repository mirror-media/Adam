import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from '../../button'
import { Spinner } from '../../spinner'

const meta = {
  title: 'UI/Spinner',
  component: Spinner,
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-mm-xl">
      <Spinner className="size-3" />
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  ),
}

export const WithVisibleLabel: Story = {
  render: () => (
    <div className="inline-flex items-center gap-mm-m" role="status">
      <Spinner aria-hidden="true" role="presentation" />
      <span className="font-mm-sans text-mm-body2">載入中</span>
    </div>
  ),
}

export const InButton: Story = {
  render: () => (
    <Button isLoading>
      <Spinner
        aria-hidden="true"
        data-icon="inline-start"
        role="presentation"
      />
      載入中
    </Button>
  ),
}
