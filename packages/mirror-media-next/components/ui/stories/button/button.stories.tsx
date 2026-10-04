import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button, type ButtonSize, type ButtonVariant } from '../../button'
import { Spinner } from '../../spinner'

function ArrowDownIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 16.016c-.186 0-.352-.071-.498-.213L5.833 10.002a.72.72 0 0 1-.198-.476c0-.127.029-.241.088-.344a.69.69 0 0 1 .234-.242.66.66 0 0 1 .345-.087c.185 0 .344.063.476.19l5.61 5.735h-.784l5.611-5.735a.676.676 0 0 1 .476-.19c.127 0 .239.029.337.087a.73.73 0 0 1 .241.242.67.67 0 0 1 .088.344c0 .181-.066.337-.197.469l-5.67 5.808a.749.749 0 0 1-.226.161.672.672 0 0 1-.264.052Z"
        fill="currentColor"
      />
    </svg>
  )
}

function SearchButtonIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 30 28"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.092.5c-3.833 0-7.316 1.512-9.831 3.954a1.19 1.19 0 0 0 0 1.71c.233.224.548.35.876.35.329 0 .644-.126.877-.35 2.068-2.008 4.917-3.25 8.078-3.25 6.322 0 11.42 4.949 11.42 11.086 0 6.137-5.098 11.087-11.42 11.087-3.161 0-6.01-1.243-8.078-3.25a1.265 1.265 0 0 0-.877-.351c-.328 0-.643.126-.876.35a1.19 1.19 0 0 0 0 1.71C8.776 25.988 12.259 27.5 16.092 27.5 23.759 27.5 30 21.44 30 14S23.759.5 16.092.5Z"
        fill="currentColor"
      />
      <path
        d="M12.017 8.479a1.25 1.25 0 0 0-1.151 1.427c.06.314.246.591.517.772L16.368 14l-4.985 3.322a1.2 1.2 0 0 0-.517.772 1.174 1.174 0 0 0 .196.902c.186.263.473.443.796.501.324.059.658-.01.93-.19l6.48-4.31c.168-.11.306-.259.4-.433a1.17 1.17 0 0 0 0-1.128 1.223 1.223 0 0 0-.4-.433l-6.48-4.31a1.32 1.32 0 0 0-.771-.214Z"
        fill="currentColor"
      />
      <path
        d="M1.239 12.655a1.244 1.244 0 0 0-.879 2.057c.231.226.547.355.879.357h16.304c.164 0 .327-.03.478-.091.152-.061.29-.15.406-.263a1.2 1.2 0 0 0 .364-.858 1.2 1.2 0 0 0-.367-.852 1.274 1.274 0 0 0-.881-.35H1.239Z"
        fill="currentColor"
      />
    </svg>
  )
}

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'outline',
        'secondary',
        'ghost',
        'destructive',
        'link',
        'icon',
        'icon-search',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon', 'icon-sm'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

const textVariants = [
  ['default', '贊助本文'],
  ['secondary', '加入訂閱會員'],
  ['outline', '看更多'],
  ['ghost', 'Ghost'],
  ['destructive', 'Destructive'],
  ['link', 'Link'],
] satisfies Array<[ButtonVariant, string]>

const sizes = [
  ['sm', 'Small'],
  ['default', 'Default'],
  ['lg', 'Large'],
] satisfies Array<[ButtonSize, string]>

export const Default: Story = {
  args: {
    children: '贊助本文',
  },
}

export const Outline: Story = {
  args: {
    children: '看更多',
    variant: 'outline',
  },
}

export const Secondary: Story = {
  args: {
    children: '加入訂閱會員',
    variant: 'secondary',
  },
}

export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
}

export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
}

export const Link: Story = {
  args: {
    children: 'Link',
    variant: 'link',
  },
}

export const Icon: Story = {
  args: {
    'aria-label': 'Close',
    children: '×',
    variant: 'icon',
  },
}

export const BrandIcon: Story = {
  args: {
    'aria-label': 'Scroll down',
    children: <ArrowDownIcon />,
    variant: 'icon',
  },
}

export const BrandSearchIcon: Story = {
  args: {
    'aria-label': 'Search',
    children: <SearchButtonIcon />,
    variant: 'icon-search',
  },
}

export const Loading: Story = {
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

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
}

export const LongText: Story = {
  args: {
    children: '這是一段很長的中文與 English mixed button label',
    className: 'max-w-60 whitespace-normal',
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-mm-m">
      {textVariants.map(([variant, label]) => (
        <Button key={variant} variant={variant}>
          {label}
        </Button>
      ))}
      <Button aria-label="Scroll down" variant="icon">
        <ArrowDownIcon />
      </Button>
      <Button aria-label="Search" variant="icon-search">
        <SearchButtonIcon />
      </Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-mm-m">
      {sizes.map(([size, label]) => (
        <Button key={size} size={size}>
          {label}
        </Button>
      ))}
      <Button aria-label="Small icon" size="icon-sm" variant="icon">
        <ArrowDownIcon />
      </Button>
      <Button aria-label="Default icon" size="icon" variant="icon">
        <ArrowDownIcon />
      </Button>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="grid gap-mm-l">
      <div className="flex flex-wrap items-center gap-mm-m">
        <Button>贊助本文</Button>
        <Button disabled>Disabled</Button>
        <Button isLoading>
          <Spinner
            aria-hidden="true"
            data-icon="inline-start"
            role="presentation"
          />
          載入中
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-mm-m">
        <Button variant="secondary">加入訂閱會員</Button>
        <Button disabled variant="secondary">
          Disabled
        </Button>
        <Button isLoading variant="secondary">
          <Spinner
            aria-hidden="true"
            data-icon="inline-start"
            role="presentation"
          />
          載入中
        </Button>
      </div>
    </div>
  ),
}
