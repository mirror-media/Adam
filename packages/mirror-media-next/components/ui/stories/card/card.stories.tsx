import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Card } from '../../card'
import { Link } from '../../link'
import { Typography } from '../../typography'

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <Typography variant="h3">Card title</Typography>
        <Typography variant="body2">
          Card uses the approved radius and neutral surface tokens.
        </Typography>
        <Link href="/">Back to homepage</Link>
      </>
    ),
    className: 'grid max-w-md gap-mm-l',
  },
}
