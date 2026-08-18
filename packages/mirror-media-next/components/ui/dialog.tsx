import type { ComponentProps } from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'

import { cn } from '@/components/cn'
import { Button } from '@/components/ui/button'

/*
 * z-index: the legacy styled-components scale in constants/index.ts goes up to
 * 10000 (Z_INDEX.top), so shadcn's default z-50/z-51 would be covered by any
 * legacy floating element (PromoteTopic at 500, headers at 1000). The values
 * below mirror Z_INDEX.shellOverlay/shellOverlayContent: high enough to clear
 * the shell header and cover headers, still below Z_INDEX.top so global
 * dialogs such as IdleTimeoutModal stay on top.
 * Update both places together, or replace them with a shared token scale.
 */

function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal(props: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      className={cn(
        'fixed inset-0 isolate z-[2500] bg-mm-neutral-900/40 supports-backdrop-filter:backdrop-blur-xs',
        className
      )}
      data-slot="dialog-overlay"
      {...props}
    />
  )
}

type DialogContentProps = DialogPrimitive.Popup.Props & {
  closeLabel?: string
  showCloseButton?: boolean
}

function DialogContent({
  children,
  className,
  closeLabel = '關閉對話框',
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        className={cn(
          'fixed top-1/2 left-1/2 z-[2501] grid max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-mm-xl overflow-y-auto rounded-mm-l border border-mm-neutral-300 bg-mm-neutral-0 p-mm-xl font-mm-sans text-mm-body2 text-mm-neutral-900 shadow-lg outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-second-500 focus-visible:outline-solid sm:max-w-[480px]',
          className
        )}
        data-slot="dialog-content"
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                aria-label={closeLabel}
                className="absolute top-mm-m right-mm-m"
                size="icon-sm"
                variant="ghost"
              />
            }
          >
            <XIcon aria-hidden="true" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-mm-m', className)}
      data-slot="dialog-header"
      {...props}
    />
  )
}

type DialogFooterProps = ComponentProps<'div'> & {
  showCloseButton?: boolean
}

function DialogFooter({
  children,
  className,
  showCloseButton = false,
  ...props
}: DialogFooterProps) {
  return (
    <div
      className={cn(
        '-mx-mm-xl -mb-mm-xl flex flex-col-reverse gap-mm-m rounded-b-mm-l border-t border-mm-neutral-300 bg-mm-neutral-50 p-mm-xl sm:flex-row sm:justify-end',
        className
      )}
      data-slot="dialog-footer"
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          關閉
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      className={cn('font-mm-sans text-mm-h6 text-mm-neutral-900', className)}
      data-slot="dialog-title"
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      className={cn(
        'font-mm-sans text-mm-body2 text-mm-neutral-600 *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-mm-base-700',
        className
      )}
      data-slot="dialog-description"
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
export type { DialogContentProps, DialogFooterProps }
