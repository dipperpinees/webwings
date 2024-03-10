import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo("en-US");

export function getTimeAgo(date: Date) {
    return timeAgo.format(date.valueOf());
}

export function getTimeString(datetime: Date) {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const month = monthNames[datetime.getMonth()];
    const day = datetime.getDate();
    const year = datetime.getFullYear();
    let hours = datetime.getHours();
    const minutes = datetime.getMinutes();

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedDateTime =
        month + " " + day + ", " + year + " at " + hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + " " + ampm;

    return formattedDateTime;
}
