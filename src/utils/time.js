import dayjs from 'dayjs'
const date = 'YYYY-MM-DD'
const dateTime = 'YYYY-MM-DD HH:mm'

// 今天
export const today = dayjs().format(date)

// 半年前
export const halfYearAgo = dayjs().add(-6, 'month').format(date)

export const transferDateTime = (date) => {
  return dayjs(date).format(dateTime)
}
