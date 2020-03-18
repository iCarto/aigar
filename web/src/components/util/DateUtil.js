import moment from "moment";

const DateUtil = {
    getMonthName(monthNumber) {
        const month = moment.months(monthNumber);
        return month.charAt(0).toLocaleUpperCase() + month.slice(1);
    },
};

export default DateUtil;
