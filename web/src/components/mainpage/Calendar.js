import React from "react";
import moment from "moment";

const clickPrevious = (setDate, date) => {
    // Hay que clonar date
    const _date = moment(date).subtract(1, "month");
    setDate(_date);
};

const clickNext = (setDate, date) => {
    // Hay que clonar date
    const _date = moment(date).add(1, "month");
    setDate(_date);
};

const changeMonth = (setDate, date, e) => {
    // Hay que clonar date
    const _date = moment(date).month(e.target.value);
    setDate(_date);
};

const changeYear = (setDate, date, e) => {
    // Hay que clonar date
    const _date = moment(date).year(e.target.value);
    setDate(_date);
};

function Calendar(props) {
    const {date, setDate} = props;
    const localeData = moment.localeData();
    const currentMonth = localeData.months(date);
    const currentYear = date.year();
    const FIRST_YEAR = 2019;
    const monthOptions = moment.months().map(m => {
        return (
            <option key={m} value={m}>
                {m[0].toLocaleUpperCase()}
                {m.slice(1)}
            </option>
        );
    });
    const yearOptions = Array(moment().year() - FIRST_YEAR)
        .fill(undefined)
        .map((row, index) => {
            const y = FIRST_YEAR + 1 + index;
            return (
                <option key={y} value={y}>
                    {y}
                </option>
            );
        });
    return (
        <form className="form-inline">
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => clickPrevious(setDate, date)}
            >
                &laquo; Mes anterior
            </button>
            <select
                className="custom-select"
                id="inlineFormCustomSelectPref"
                value={currentMonth}
                onChange={e => changeMonth(setDate, date, e)}
            >
                {monthOptions}
            </select>
            <label className="">de</label>
            <select
                className="custom-select"
                id="inlineFormCustomSelectPref"
                value={currentYear}
                onChange={e => changeYear(setDate, date, e)}
            >
                {yearOptions}
            </select>

            <button
                type="button"
                className="btn btn-primary"
                onClick={() => clickNext(setDate, date)}
                disabled
            >
                Mes Siguiente &raquo;
            </button>
        </form>
    );
}

export default Calendar;

/*
props.date.format("MMM")
"ene."
props.date.format("MMMM")
"enero"
props.date.format("YYYY")
"2020"
props.date.format("L")
"30/01/2020"
props.date.format("LL")
"30 de enero de 2020"


moment([2010, 1, 28]).add(1, 'month'); // March 28
moment([2010, 1, 28]).add(1, 'year'); // March 28




end.from(start);       // "in 5 days"
end.from(start, true); // "5 days"

moment().fromNow();
moment().fromNow(Boolean);

moment().toNow();
moment().toNow(Boolean);

moment().to(Moment|String|Number|Date|Array);
moment().to(Moment|String|Number|Date|Array, Boolean);

calendar



moment.updateLocale('en', {
    months : [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ]
});
*/
