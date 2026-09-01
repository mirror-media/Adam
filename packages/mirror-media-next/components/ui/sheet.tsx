import type { ComponentProps } from 'react'
import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'

import { cn } from '@/components/cn'
import { Button } from '@/components/ui/button'

type SheetSide = 'top' | 'right' | 'bottom' | 'left'

function Sheet(props: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger(props: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(props: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal(props: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      className={cn(
        'fixed inset-0 z-(--mm-z-shell-overlay) bg-mm-neutral-900/40 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs',
        className
      )}
      data-slot="sheet-overlay"
      {...props}
    />
  )
}

type SheetContentProps = SheetPrimitive.Popup.Props & {
  closeLabel?: string
  side?: SheetSide
  showCloseButton?: boolean
}

function SheetContent({
  children,
  className,
  closeLabel = '關閉面板',
  side = 'right',
  showCloseButton = true,
  ...props
}: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        className={cn(
          'fixed z-(--mm-z-shell-overlay-content) flex flex-col gap-mm-xl overflow-y-auto border-mm-neutral-300 bg-mm-neutral-0 bg-clip-padding font-mm-sans text-mm-body2 text-mm-neutral-900 shadow-lg transition duration-200 ease-in-out outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-neutral-900 focus-visible:outline-solid data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:max-h-[90dvh] data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-10 data-[side=bottom]:data-starting-style:translate-y-10 data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:-translate-x-10 data-[side=left]:data-starting-style:-translate-x-10 data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-10 data-[side=right]:data-starting-style:translate-x-10 data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:max-h-[90dvh] data-[side=top]:border-b data-[side=top]:data-ending-style:-translate-y-10 data-[side=top]:data-starting-style:-translate-y-10 data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm',
          className
        )}
        data-side={side}
        data-slot="sheet-content"
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                aria-label={closeLabel}
                className="absolute top-mm-l right-mm-l"
                size="icon-sm"
                variant="ghost"
              />
            }
          >
            <XIcon aria-hidden="true" />
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-mm-s p-mm-xl', className)}
      data-slot="sheet-header"
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('mt-auto flex flex-col gap-mm-m p-mm-xl', className)}
      data-slot="sheet-footer"
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      className={cn('font-mm-sans text-mm-h6 text-mm-neutral-900', className)}
      data-slot="sheet-title"
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      className={cn(
        'font-mm-sans text-mm-body2 text-mm-neutral-600',
        className
      )}
      data-slot="sheet-description"
      {...props}
    />
  )
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
}
export type { SheetContentProps, SheetSide }
