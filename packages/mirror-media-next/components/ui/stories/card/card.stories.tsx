import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Badge } from '../../badge'
import { Button } from '../../button'
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

export const ArticlePreview: Story = {
  render: () => (
    <Card className="grid max-w-md gap-mm-l">
      <div className="flex flex-wrap gap-mm-s">
        <Badge variant="solid-base">政治社會</Badge>
        <Badge>調查</Badge>
      </div>
      <Typography variant="h4">文章卡片標題 Mirror Media</Typography>
      <Typography className="text-mm-neutral-700" variant="body2">
        這是一段卡片摘要，用來檢查標題、分類標籤、內文與操作按鈕在同一個 card
        surface 內的間距與閱讀節奏。
      </Typography>
      <div className="flex flex-wrap gap-mm-m">
        <Button size="sm">贊助本文</Button>
        <Link href="/" variant="muted">
          返回首頁
        </Link>
      </div>
    </Card>
  ),
}

export const LongContent: Story = {
  render: () => (
    <Card className="grid max-w-sm gap-mm-l">
      <Typography variant="h5">
        這是一段很長的中文標題與 English mixed title，用來檢查卡片內文字換行
      </Typography>
      <Typography className="text-mm-neutral-700" variant="body2">
        Card primitive 保持單層 surface，不在卡片內再包另一張卡片；這個 story
        用於檢查窄寬度下文字不溢位。
      </Typography>
    </Card>
  ),
}
