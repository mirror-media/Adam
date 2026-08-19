import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../accordion'

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: '停用整組 accordion，個別項目另有自己的 disabled。',
    },
    multiple: {
      control: 'boolean',
      description: '是否允許同時展開多個項目；展開第二個項目即可驗證。',
    },
  },
} satisfies Meta<typeof Accordion>

export default meta

type Story = StoryObj<typeof meta>

function ExampleItems({ includeDisabled = false }) {
  return (
    <>
      <AccordionItem value="item-1">
        <AccordionTrigger>如何重設密碼？</AccordionTrigger>
        <AccordionContent>
          請在登入頁選擇「忘記密碼」，系統會寄送重設連結至會員信箱。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem disabled={includeDisabled} value="item-2">
        <AccordionTrigger>可以變更訂閱方案嗎？</AccordionTrigger>
        <AccordionContent>
          可在訂閱紀錄中查看目前方案與可用選項。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          這是一段用來確認內容不會被裁切、仍能換行且維持完整操作範圍的長標題
        </AccordionTrigger>
        <AccordionContent>
          長內容會在可用寬度內自然換行，不產生水平捲動。
        </AccordionContent>
      </AccordionItem>
    </>
  )
}

export const Single: Story = {
  args: {
    disabled: false,
    multiple: false,
  },
  render: (args) => (
    <Accordion {...args} className="max-w-xl" defaultValue={['item-1']}>
      <ExampleItems />
    </Accordion>
  ),
}

export const Multiple: Story = {
  render: () => (
    <Accordion
      className="max-w-xl"
      defaultValue={['item-1', 'item-3']}
      multiple
    >
      <ExampleItems />
    </Accordion>
  ),
}

export const DisabledItem: Story = {
  render: () => (
    <Accordion className="max-w-xl">
      <ExampleItems includeDisabled />
    </Accordion>
  ),
}

export const MobileLongLabels: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
  render: () => (
    <Accordion className="max-w-75">
      <ExampleItems />
    </Accordion>
  ),
}
