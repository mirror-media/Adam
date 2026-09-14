import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/components/cn'
import { Typography } from '@/components/ui'

import { ThemeElement } from './theme-element'

type ArticleSummaryProps = {
  items: string[]
}

export function ArticleSummary({ items }: ArticleSummaryProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="w-106 space-y-4">
      <ThemeElement
        as="button"
        type="button"
        className="flex w-full items-center justify-center gap-x-2.5 rounded-full border border-mm-base-500 px-2 py-1 text-center"
        onClick={() => {
          setIsOpen((prev) => !prev)
        }}
      >
        <Typography variant="body-s" className="font-bold text-mm-base-500">
          文章目錄
        </Typography>
        <ChevronDown
          className={cn(
            'h-5 w-5 stroke-mm-base-500 transition-transform duration-200',
            {
              'rotate-180': isOpen,
            }
          )}
        />
      </ThemeElement>

      <summary
        className={cn(
          'origin-top overflow-hidden transition-transform duration-200 ease-linear',
          {
            'h-0': !isOpen,
            'h-auto': isOpen,
          }
        )}
      >
        <ul>
          {items.map((item, index) => (
            <li key={index} className="ml-5 list-decimal text-mm-base-700">
              <Typography
                as="a"
                href={`#heading-${index + 1}`}
                variant="body-l"
                className="text-mm-base-700"
              >
                {item}
              </Typography>
            </li>
          ))}
        </ul>
      </summary>
    </div>
  )
}
