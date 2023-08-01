import moment from "moment";
import "moment/locale/es";

const BANK_DATEFORMAT = "DD/MM/YYYY";
const TIGO_DATEFORMAT = "YYYYMMDD";
const API_DATEFORMAT = "YYYY-MM-DD";

const DateUtil = {
    getMonthName(monthNumber) {
        moment.locale("es");
        const month = moment.months(parseInt(monthNumber) - 1);
        return month.charAt(0).toLocaleUpperCase() + month.slice(1);
    },

    getShortMonthName(monthNumber) {
        const month = moment.months(parseInt(monthNumber) - 1);
        return (month.charAt(0).toLocaleUpperCase() + month.slice(1)).substring(0, 3);
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
        if (date.indexOf("/") >= 0) {
            return moment(date, BANK_DATEFORMAT, true).isValid();
        }
        return moment(date, TIGO_DATEFORMAT).isValid();
    },
};

export default DateUtil;
