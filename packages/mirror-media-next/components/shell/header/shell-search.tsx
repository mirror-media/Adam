import type { FormEvent } from 'react'
import { SearchIcon } from 'lucide-react'

import { cn } from '@/components/cn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useSearch from '@/hooks/use-search'

type ShellSearchProps = {
  className?: string
  compact?: boolean
  onNavigate?: () => void
}

function ShellSearch({
  className,
  compact = false,
  onNavigate,
}: ShellSearchProps) {
  const { goSearchPage, searchTerms, setSearchTerms } = useSearch()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (searchTerms.trim()) {
      onNavigate?.()
    }
    goSearchPage()
  }

  return (
    <form
      className={cn('flex min-w-0 items-center gap-mm-m', className)}
      onSubmit={handleSubmit}
      role="search"
    >
      <label
        className="sr-only"
        htmlFor={compact ? 'shell-menu-search' : 'shell-search'}
      >
        搜尋全文
      </label>
      <div className="relative min-w-0 flex-1">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-mm-l size-4 -translate-y-1/2 text-mm-neutral-600"
        />
        <Input
          autoComplete="off"
          className="h-7 rounded-mm-full border-mm-neutral-500 py-0 pr-mm-l pl-9"
          id={compact ? 'shell-menu-search' : 'shell-search'}
          onChange={(event) => setSearchTerms(event.target.value)}
          placeholder="搜尋文字"
          type="search"
          value={searchTerms}
        />
      </div>
      {compact && (
        <Button
          aria-label="送出搜尋"
          className="focus-visible:outline-mm-neutral-0"
          size="icon"
          type="submit"
          variant="icon-search"
        >
          <SearchIcon aria-hidden="true" />
        </Button>
      )}
    </form>
  )
}

export { ShellSearch }
