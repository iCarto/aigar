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

    fromYearMonthDay(year, monthIndex, day) {
        // const date = new Date(Date.UTC(year, monthIndex, day));
        const date = new Date(year, monthIndex, day);
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
            return this.fromYearMonthDay(s.year(), s.month(), s.date());
        }
        const tokens = s.split("/");
        return this.fromYearMonthDay(tokens[2], tokens[1] - 1, tokens[0]);
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
            return this.fromYearMonthDay(s.year(), s.month(), s.date());
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

    /* Given a JavaScript Date, returns a new JavaScript Date object with the numbers
       of months substracted
    */
    substractMonth(date, number) {
        if (!(date instanceof Date)) {
            throw new Error("Is not a date");
        }
        console.log(date);
        const momentDate = moment(date);
        console.log(momentDate);
        momentDate.subtract(number, "months");
        console.log(momentDate);
        console.log(date);
        return this.fromYearMonthDay(
            momentDate.year(),
            momentDate.month(),
            momentDate.date()
        );
    },
};

export default DateUtil;
