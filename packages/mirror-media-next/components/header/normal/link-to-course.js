import styled from 'styled-components'
import Link from 'next/link'
import Image from 'next/image'
import { COURSE_URL } from '../../../config/index.mjs'
import LogoCourseHorizontal from '../../../public/images-next/course-horizontal.png'
import LogoCourseVertial from '../../../public/images-next/course-vertical.png'

const Container = styled(Link)`
  display: inline-block;
  flex-shrink: 0;
  align-self: center;
  margin-left: 8px;
`

const MobileIcon = styled(Image)`
  display: none;
  ${({ theme }) => theme.breakpoint.md} {
    display: inline-block;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const DesktopIcon = styled(Image)`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: inline-block;
  }
`

export default function LinkToCourse() {
  return (
    <Container href={COURSE_URL} target="_blank">
      <MobileIcon src={LogoCourseVertial} width={60} height={48} alt="課程" />
      <DesktopIcon
        src={LogoCourseHorizontal}
        width={120}
        height={30}
        alt="課程"
      />
    </Container>
  )
}
