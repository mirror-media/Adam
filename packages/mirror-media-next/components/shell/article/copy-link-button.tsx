import { useState } from 'react'
import { Dialog } from '@base-ui/react'

type ButtonProps = {
  children: React.ReactNode
  renderTitle?: () => React.ReactNode
  renderContent?: () => React.ReactNode
  timeout?: number
}

export function CopyLinkButton({
  children,
  renderTitle,
  renderContent,
  timeout = 3000,
}: ButtonProps) {
  const [open, setOpen] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setOpen(true)
      setTimeout(() => {
        setOpen(false)
      }, timeout)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger onClick={handleCopy}>{children}</Dialog.Trigger>
      <Dialog.Portal>
        {/* <Dialog.Backdrop /> */}
        <Dialog.Viewport>
          <Dialog.Popup
            id="copy-link-message"
            role="status"
            className="fixed bottom-1/4 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-200 data-open:opacity-100 md:top-1/2 md:left-1/2 md:-translate-x-1/2"
          >
            {renderTitle && <Dialog.Title>{renderTitle()}</Dialog.Title>}
            {renderContent && (
              <Dialog.Description>{renderContent()}</Dialog.Description>
            )}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
