import { Popover as PopoverPrimitive } from '@base-ui/react/popover'

import { cn } from '@/components/cn'

function Popover(props: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root {...props} />
}

function PopoverTrigger(props: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverPortal(props: PopoverPrimitive.Portal.Props) {
  return <PopoverPrimitive.Portal {...props} />
}

function PopoverPositioner({
  className,
  sideOffset = 8,
  ...props
}: PopoverPrimitive.Positioner.Props) {
  return (
    <PopoverPrimitive.Positioner
      className={cn('z-(--mm-z-shell-popover) outline-none', className)}
      data-slot="popover-positioner"
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function PopoverPopup({ className, ...props }: PopoverPrimitive.Popup.Props) {
  return (
    <PopoverPrimitive.Popup
      className={cn(
        'origin-(--transform-origin) rounded-mm-m border border-mm-neutral-300 bg-mm-neutral-0 p-mm-l font-mm-sans text-mm-body2 text-mm-neutral-900 shadow-lg transition-[transform,scale,opacity] duration-150 outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
        className
      )}
      data-slot="popover-popup"
      {...props}
    />
  )
}

export {
  Popover,
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
}
