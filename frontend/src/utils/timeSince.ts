import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')

export default function getTimeAgo(date: Date) {
    return timeAgo.format(date.valueOf())
}