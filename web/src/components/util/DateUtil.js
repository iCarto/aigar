import moment from "moment";

const DateUtil = {
    getMonthName(monthNumber) {
        const month = moment.months(parseInt(monthNumber) - 1);
        return month.charAt(0).toLocaleUpperCase() + month.slice(1);
    },
};

export default DateUtil;
