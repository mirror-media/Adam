import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

export const transformTimeData = (time, format) => {
  dayjs.extend(utc)

  const timeData = dayjs(time).utcOffset(8)

  if (!timeData.isValid()) {
    return undefined
  } else {
    switch (format) {
      case 'dot':
        return timeData.format('YYYY.MM.DD HH:mm')

      case 'slash':
        return timeData.format('YYYY/MM/DD')

      case 'slashWithTime':
        return timeData.format('YYYY/MM/DD HH:mm')

      case 'dash':
        return timeData.format('YYYY-MM-DD')

      default:
        return undefined
    }
  }
}
