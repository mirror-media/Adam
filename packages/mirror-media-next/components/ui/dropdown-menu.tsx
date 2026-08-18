import { Menu as DropdownMenuPrimitive } from '@base-ui/react/menu'

import { cn } from '@/components/cn'

/*
 * z-index: the legacy styled-components scale in constants/index.ts goes up to
 * 10000 (Z_INDEX.top), so shadcn's default z-50/z-51 would be covered by any
 * legacy floating element (PromoteTopic at 500, headers at 1000). The values
 * below mirror Z_INDEX.shellOverlay/shellOverlayContent: high enough to clear
 * the shell header and cover headers, still below Z_INDEX.top so global
 * dialogs such as IdleTimeoutModal stay on top.
 * Update both places together, or replace them with a shared token scale.
 */

function DropdownMenu(props: DropdownMenuPrimitive.Root.Props) {
  return <DropdownMenuPrimitive.Root {...props} />
}

function DropdownMenuTrigger(props: DropdownMenuPrimitive.Trigger.Props) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

function DropdownMenuPortal(props: DropdownMenuPrimitive.Portal.Props) {
  return <DropdownMenuPrimitive.Portal {...props} />
}

function DropdownMenuPositioner({
  className,
  sideOffset = 8,
  ...props
}: DropdownMenuPrimitive.Positioner.Props) {
  return (
    <DropdownMenuPrimitive.Positioner
      className={cn('z-[2600] outline-none', className)}
      data-slot="dropdown-menu-positioner"
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function DropdownMenuPopup({
  className,
  ...props
}: DropdownMenuPrimitive.Popup.Props) {
  return (
    <DropdownMenuPrimitive.Popup
      className={cn(
        'min-w-36 origin-(--transform-origin) rounded-mm-m border border-mm-neutral-300 bg-mm-neutral-0 p-mm-s font-mm-sans text-mm-body2 text-mm-neutral-900 shadow-lg transition-[transform,scale,opacity] duration-150 outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
        className
      )}
      data-slot="dropdown-menu-popup"
      {...props}
    />
  )
}

const dropdownMenuItemClass =
  'flex min-h-9 w-full cursor-pointer items-center rounded-mm-s px-mm-l py-mm-m text-left outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-mm-neutral-100 data-highlighted:text-mm-base-700'

function DropdownMenuItem({
  className,
  ...props
}: DropdownMenuPrimitive.Item.Props) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(dropdownMenuItemClass, className)}
      data-slot="dropdown-menu-item"
      {...props}
    />
  )
}

function DropdownMenuLinkItem({
  className,
  closeOnClick = true,
  ...props
}: DropdownMenuPrimitive.LinkItem.Props) {
  return (
    <DropdownMenuPrimitive.LinkItem
      className={cn(dropdownMenuItemClass, className)}
      closeOnClick={closeOnClick}
      data-slot="dropdown-menu-link-item"
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuPrimitive.Separator.Props) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn('-mx-mm-s my-mm-s h-px bg-mm-neutral-200', className)}
      data-slot="dropdown-menu-separator"
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuPopup,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
}
