import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Badge } from '../../badge'
import { Typography, type TypographyVariant } from '../../typography'

const typographySamples = [
  ['hero-title', 'Hero Title'],
  ['h1', 'H1'],
  ['h2', 'H2'],
  ['h3', 'H3'],
  ['h4', 'H4'],
  ['h5', 'H5'],
  ['h6', 'H6'],
  ['subtitle', 'subtitle'],
  ['body2', 'Body2'],
  ['body-l', 'body_L'],
  ['body-m', 'body_M'],
  ['body-s', 'body_S'],
  ['caption-l', 'caption_L'],
  ['caption-s', 'caption_S'],
] satisfies Array<[TypographyVariant, string]>

const meta = {
  title: 'UI/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'hero-title',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'subtitle',
        'body2',
        'body-l',
        'body-m',
        'body-s',
        'caption-l',
        'caption-s',
      ],
    },
  },
} satisfies Meta<typeof Typography>

export default meta

type Story = StoryObj<typeof meta>

export const Body: Story = {
  args: {
    children: '鏡週刊 Mirror Media mixed typography sample 123',
    variant: 'body-m',
  },
}

export const Scale: Story = {
  args: {
    children: '鏡週刊 Mirror Media mixed typography sample 123',
  },
  render: () => (
    <div className="grid gap-mm-2xl">
      {typographySamples.map(([variant, label]) => (
        <div className="grid gap-mm-s" key={variant}>
          <Badge>{label}</Badge>
          <Typography variant={variant}>
            鏡週刊 Mirror Media mixed typography sample 123
          </Typography>
        </div>
      ))}
    </div>
  ),
}

export const MixedParagraph: Story = {
  args: {
    children: '鏡週刊 Mirror Media mixed typography sample 123',
  },
  render: () => (
    <div className="grid max-w-2xl gap-mm-l">
      <Typography variant="h3">混排段落標題 Mirror Media</Typography>
      <Typography variant="body-m">
        這是一段中文、English、數字 123 與標點符號混排的段落，用來檢查
        line-height 與 CJK fallback 在一般閱讀情境下的表現。
      </Typography>
      <Typography className="text-mm-neutral-600" variant="caption-l">
        Caption sample: 2026.08.06 / Mirror Media
      </Typography>
    </div>
  ),
}
