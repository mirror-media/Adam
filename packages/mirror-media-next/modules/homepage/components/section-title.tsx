import { Typography } from '@/components/ui/typography'

type SectionTitleProps = {
  children: string
  id: string
}

function SectionTitle({ children, id }: SectionTitleProps) {
  return (
    <Typography
      as="h2"
      className="bg-[linear-gradient(to_right,#013958,#fff)] px-mm-l py-[5px] text-mm-second-200"
      id={id}
      variant="h5"
    >
      {children}
    </Typography>
  )
}

export { SectionTitle }
