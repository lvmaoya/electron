import dayjs from "dayjs";

export const strToDayjs = (dateStr) => {
    const formattedStr = dateStr.replace('年', '-').replace('月', '');
    return dayjs(formattedStr);
};