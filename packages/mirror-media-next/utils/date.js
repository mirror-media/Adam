/**
 * Check if the date is in between the date range
 * @param {string | number | Date} date - any format that Date class can take
 * @param {{startDate: string | number | Date, endDate: string | number | Date}} dateRange - start and end date in any format that Date can take
 * @returns {boolean}
 */
export function isDateInsideDatesRange(date, dateRange) {
  const currentDate = new Date(date)
  const startDate = new Date(dateRange.startDate)
  const endDate = new Date(dateRange.endDate)

  return currentDate >= startDate && currentDate <= endDate
}
