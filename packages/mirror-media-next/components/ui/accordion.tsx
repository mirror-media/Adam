import type { ReactNode } from 'react'
import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

import { cn } from '@/components/cn'

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      className={cn('flex w-full flex-col', className)}
      data-slot="accordion"
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      className={cn(
        'not-last:border-b not-last:border-mm-neutral-300',
        className
      )}
      data-slot="accordion-item"
      {...props}
    />
  )
}

type AccordionTriggerProps = AccordionPrimitive.Trigger.Props & {
  /**
   * Replaces the default expand/collapse chevrons. Useful when a design
   * calls for a different indicator; the node is rendered as-is, so the
   * consumer owns its open/closed styling.
   */
  icon?: ReactNode
}

function AccordionTrigger({
  children,
  className,
  icon,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'group/accordion-trigger relative flex flex-1 items-start justify-between rounded-mm-m border border-transparent py-mm-l text-left font-mm-sans text-mm-body2 font-medium text-mm-neutral-900 transition-colors outline-none hover:text-mm-base-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-second-500 focus-visible:outline-solid aria-disabled:pointer-events-none aria-disabled:opacity-50',
          className
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        {children}
        {icon ?? (
          <>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none ml-auto size-4 shrink-0 text-mm-neutral-600 group-aria-expanded/accordion-trigger:hidden"
              data-slot="accordion-trigger-icon"
            />
            <ChevronUpIcon
              aria-hidden="true"
              className="pointer-events-none ml-auto hidden size-4 shrink-0 text-mm-neutral-600 group-aria-expanded/accordion-trigger:inline"
              data-slot="accordion-trigger-icon"
            />
          </>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  children,
  className,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      className="overflow-hidden font-mm-sans text-mm-body2 text-mm-neutral-700"
      data-slot="accordion-content"
      {...props}
    >
      <div
        className={cn(
          'h-(--accordion-panel-height) pt-0 pb-mm-l transition-[height] data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-mm-base-700 [&_p:not(:last-child)]:mb-mm-xl',
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
export type { AccordionTriggerProps }
