import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Card } from '../../card'
import { Container } from '../../container'
import { Typography } from '../../typography'

const meta = {
  title: 'UI/Container',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['mobile', 'tablet', 'desktop', 'full'],
    },
  },
} satisfies Meta<typeof Container>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  args: {
    children: (
      <Card className="grid gap-mm-l">
        <Typography variant="h3">Container</Typography>
        <Typography variant="body2">
          Uses the Figma-sourced 1280 / 768 / 375 width contract.
        </Typography>
      </Card>
    ),
    size: 'desktop',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-mm-2xl">
      {(['mobile', 'tablet', 'desktop'] as const).map((size) => (
        <Container className="px-0" key={size} size={size}>
          <Card>
            <Typography variant="subtitle">{size}</Typography>
          </Card>
        </Container>
      ))}
    </div>
  ),
}
