import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Link } from '../../link'

const meta = {
  title: 'UI/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'muted', 'plain'],
    },
  },
} satisfies Meta<typeof Link>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Back to homepage',
    href: '/',
  },
}

export const Muted: Story = {
  args: {
    children: 'Secondary link',
    href: '/',
    variant: 'muted',
  },
}

export const Plain: Story = {
  args: {
    children: '登入',
    href: '/',
    variant: 'plain',
  },
}
