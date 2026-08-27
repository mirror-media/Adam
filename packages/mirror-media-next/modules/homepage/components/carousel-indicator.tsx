import { cn } from '@/components/cn'

type CarouselIndicatorSurface = 'dark' | 'light'

type CarouselIndicatorProps = {
  activeIndex: number
  count: number
  label: string
  onSelect: (index: number) => void
  surface?: CarouselIndicatorSurface
}

const surfaceClasses: Record<
  CarouselIndicatorSurface,
  { active: string; focus: string; inactive: string }
> = {
  dark: {
    active: 'bg-mm-neutral-100',
    focus: 'focus-visible:outline-mm-neutral-0',
    inactive: 'bg-mm-neutral-500',
  },
  light: {
    active: 'bg-mm-base-500',
    focus: 'focus-visible:outline-mm-neutral-900',
    inactive: 'bg-mm-neutral-300',
  },
}

function CarouselIndicator({
  activeIndex,
  count,
  label,
  onSelect,
  surface = 'dark',
}: CarouselIndicatorProps) {
  if (count <= 1) return null
  const classes = surfaceClasses[surface]

  return (
    <div
      aria-label={`${label}投影片選擇`}
      className="pointer-events-auto mx-auto flex w-fit items-center justify-center"
      role="group"
    >
      {Array.from({ length: count }, (_, index) => (
        <button
          aria-current={index === activeIndex ? 'true' : undefined}
          aria-label={`顯示第 ${index + 1} 張，共 ${count} 張`}
          className={cn(
            'grid size-6 cursor-pointer touch-manipulation place-items-center rounded-mm-full border-0 bg-transparent p-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid',
            classes.focus
          )}
          key={index}
          onClick={() => onSelect(index)}
          type="button"
        >
          <span
            aria-hidden="true"
            className={cn(
              'size-2 rounded-mm-full',
              index === activeIndex ? classes.active : classes.inactive
            )}
          />
        </button>
      ))}
    </div>
  )
}

export { CarouselIndicator }
