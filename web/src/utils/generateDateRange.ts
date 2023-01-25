import dayjs from 'dayjs'

export default function generateDateRange(): Date[] {
    const begginingOfTime = dayjs().startOf("year").add(dayjs().utcOffset(), 'minute')


    const today = dayjs().add(dayjs().utcOffset(), 'minute')

    const dates = []
    let compareDate = begginingOfTime

    while (compareDate.isBefore(today)) {
        dates.push(compareDate.toDate())
        compareDate = compareDate.add(1, 'day')
    }

    return dates
}