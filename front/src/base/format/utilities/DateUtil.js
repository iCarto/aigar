import moment from "moment";
import "moment/locale/es";

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

    cloneDate(d) {
        /* input value must be a Date like object */
        return new Date(d.getTime());
    },

    trimTime(d) {
        /* input value must be a Date like object
           returns a new Date object
        */
        var c = this.cloneDate(d);
        c.setHours(0, 0, 0, 0);
        return c;
    },

    fromYearMonthDay(year, month, day) {
        const date = new Date(Date.UTC(year, month, day));
        return this.trimTime(date);
    },

    fromLocal(s) {
        if (!s) {
            return null;
        }
        if (!this.isValidForDataLoad(s)) {
            return null;
        }
        return this.fromValidLocal(s);
    },

    fromValidLocal(s) {
        if (!s) {
            return null;
        }
        if (s instanceof Date) {
            return s;
        }
        if (moment.isMoment(s)) {
            return this.fromYearMonthDay(s.year(), s.month() + 1, s.date());
        }
        const tokens = s.split("/");
        return this.fromYearMonthDay(tokens[2], tokens[1], tokens[0]);
    },

    fromValidISO(s) {
        /**
         * value is a string in iso format: yyyy-mm-dd
         * returns a Date object with time trimed to 0
         */
        if (!s) {
            return null;
        }
        if (s instanceof Date) {
            return s;
        }
        if (moment.isMoment(s)) {
            return this.fromYearMonthDay(s.year(), s.month() + 1, s.date());
        }
        const tokens = s.split("-");
        return this.fromYearMonthDay(tokens[0], tokens[1] - 1, tokens[2]);
    },

    toLocal(d) {
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");
        return `${day}/${month}/${year}`;
    },

    toISO(d) {
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    },

    isValidForDataLoad(date) {
        const BANK_DATEFORMAT = "DD/MM/YYYY";
        return moment(date, BANK_DATEFORMAT, true).isValid();
    },
};

export default DateUtil;
