import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center border border-transparent font-mm-sans text-mm-subtitle whitespace-nowrap transition-colors outline-none select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-second-500 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      variant: {
        default:
          'rounded-mm-s bg-mm-base-700 text-mm-neutral-0 hover:bg-mm-base-500',
        outline:
          'rounded-mm-full border-mm-neutral-300 bg-mm-neutral-50 text-mm-neutral-400 hover:bg-mm-neutral-200 hover:text-mm-second-600',
        secondary:
          'rounded-mm-s bg-mm-second-500 text-mm-neutral-0 hover:bg-mm-second-400',
        destructive:
          'rounded-mm-s bg-mm-error-500 text-mm-neutral-0 hover:bg-mm-error-600 focus-visible:outline-mm-error-500',
        ghost:
          'rounded-mm-s bg-transparent text-mm-neutral-700 hover:bg-mm-neutral-100',
        link: 'h-auto rounded-none p-0 text-mm-base-500 underline-offset-4 hover:underline',
        icon: 'rounded-mm-full bg-mm-base-700 text-mm-neutral-100 hover:bg-mm-second-600',
        'icon-search':
          'rounded-mm-full bg-mm-base-300 text-mm-neutral-100 hover:bg-mm-base-200',
      },
      size: {
        default: 'h-10 gap-mm-s px-mm-xl py-mm-m',
        sm: 'h-8 gap-mm-s px-mm-l py-mm-s text-mm-caption-l',
        lg: 'h-12 gap-mm-m px-mm-2xl py-mm-l',
        icon: 'size-10 p-0',
        'icon-sm': 'size-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean
  }

function Button({
  className,
  variant = 'default',
  size,
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const resolvedSize =
    size ??
    (variant === 'icon' || variant === 'icon-search' ? 'icon' : 'default')

  return (
    <ButtonPrimitive
      data-slot="button"
      aria-busy={isLoading || undefined}
      disabled={disabled || isLoading}
      className={cn(buttonVariants({ variant, size: resolvedSize }), className)}
      {...props}
    >
      {isLoading ? 'Loading' : children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
export type { ButtonProps, ButtonSize, ButtonVariant }
