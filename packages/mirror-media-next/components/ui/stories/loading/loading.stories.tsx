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
