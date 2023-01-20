import dayjs from 'dayjs'

export default function generateDateRange(): Date[] {
    const begginingOfTime = dayjs().startOf("year")

    const today = new Date()

    const dates = []
    let compareDate = begginingOfTime

    while (compareDate.isBefore(today)) {
        dates.push(compareDate.toDate())
        compareDate = compareDate.add(1, 'day')
    }

    return dates
}