import { cn } from '@/components/cn'
import { Typography } from '@/components/ui/typography'

type TopicCardGridProps = {
  children: React.ReactNode
  className?: string
}

function TopicCardGrid({ children, className }: TopicCardGridProps) {
  return (
    <div
      className={cn(
        'itemContainer grid grid-cols-1 gap-mm-2xl md:grid-cols-2 xl:grid-cols-4',
        className
      )}
    >
      {children}
    </div>
  )
}

type TopicSectionBadgeProps = {
  children: React.ReactNode
}

function TopicSectionBadge({ children }: TopicSectionBadgeProps) {
  return (
    <span className="absolute top-0 left-0 z-1 flex h-6 items-center bg-mm-base-600 px-mm-l py-mm-s">
      <Typography as="span" className="text-mm-second-100" variant="subtitle">
        {children}
      </Typography>
    </span>
  )
}

export { TopicCardGrid, TopicSectionBadge }
export type { TopicCardGridProps, TopicSectionBadgeProps }
