import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/components/cn'

const containerVariants = cva('', {
  variants: {
    theme: {
      accent: 'bg-mm-base-700 text-mm-neutral-0',
      topic: 'bg-mm-neutral-200',
      post: 'bg-mm-second-100',
      default: '',
    },
  },
  defaultVariants: {
    theme: 'default',
  },
})

export type ElementVariantProps = NonNullable<
  VariantProps<typeof containerVariants>
>

export type ElementProps<TagName extends keyof React.JSX.IntrinsicElements> =
  useRender.ComponentProps<TagName> & ElementVariantProps & { as?: TagName }

export function ThemeElement<
  TagName extends keyof React.JSX.IntrinsicElements,
>({ className, as, theme, children, render, ...props }: ElementProps<TagName>) {
  return useRender({
    defaultTagName: as ?? 'div',
    props: mergeProps(
      {
        className: cn(containerVariants({ theme }), className),
        children,
      },
      props
    ),
    render,
  })
}
