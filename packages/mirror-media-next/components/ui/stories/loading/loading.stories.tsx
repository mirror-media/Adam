import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Loading } from '../../loading'

const meta = {
  title: 'UI/Loading',
  component: Loading,
  tags: ['autodocs'],
} satisfies Meta<typeof Loading>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
  args: {
    label: '載入中',
  },
}

export const Centered: Story = {
  render: () => (
    <div className="flex h-40 items-center justify-center rounded-mm-s border border-mm-neutral-300">
      <Loading label="載入中" />
    </div>
  ),
}
