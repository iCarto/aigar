import moment from "moment";

const BANK_DATEFORMAT = "DD/MM/YYYY";
const TIGO_DATEFORMAT = "D-MMM-YYYY";
const API_DATEFORMAT = "YYYY-MM-DD";

const DateUtil = {
    getMonthName(monthNumber) {
        const month = moment.months(parseInt(monthNumber) - 1);
        return month.charAt(0).toLocaleUpperCase() + month.slice(1);
    },

    // Transform to API format date YYYY-MM-DD from DD-MMM-YYYY or DD/MM/YYYY
    parse(date) {
        if (moment(date, TIGO_DATEFORMAT, true).isValid()) {
            return moment(date, TIGO_DATEFORMAT, true).format(API_DATEFORMAT);
        }
        return moment(date, BANK_DATEFORMAT, true).format(API_DATEFORMAT);
    },

    // Transform to UI format date DD/MM/YYYY from DD-MM-YYYY
    format(date) {
        return moment(date, API_DATEFORMAT).format(BANK_DATEFORMAT);
    },

    isValidForDataLoad(date) {
        if (date.indexOf("-") >= 0) {
            let values = date.split("-");
            // Change "ENE" to "Ene" format that is supported by moment.js
            values[1] =
                values[1].charAt(0).toUpperCase() + values[1].slice(1).toLowerCase();
            date = values.join("-");
            return moment(date, TIGO_DATEFORMAT).isValid();
        }
        return moment(date, BANK_DATEFORMAT, true).isValid();
    },
};

export default DateUtil;
