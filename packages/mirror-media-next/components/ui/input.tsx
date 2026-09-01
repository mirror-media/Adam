import { Input as InputPrimitive } from '@base-ui/react/input'

import { cn } from '@/components/cn'

type InputProps = InputPrimitive.Props & {
  hasError?: boolean
}

function Input({ className, hasError = false, ...props }: InputProps) {
  return (
    <InputPrimitive
      {...props}
      data-slot="input"
      aria-invalid={hasError || props['aria-invalid'] || undefined}
      className={cn(
        'h-10 w-full min-w-0 rounded-mm-s border border-mm-neutral-300 bg-mm-neutral-0 px-mm-l py-mm-m font-mm-sans text-mm-body2 text-mm-neutral-800 transition-colors outline-none placeholder:text-mm-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-neutral-900 focus-visible:outline-solid disabled:cursor-not-allowed disabled:bg-mm-neutral-100 disabled:text-mm-neutral-500 disabled:opacity-70',
        hasError &&
          'border-mm-error-500 bg-mm-error-100 focus-visible:outline-mm-error-500',
        className
      )}
    />
  )
}

export { Input }
export type { InputProps }
