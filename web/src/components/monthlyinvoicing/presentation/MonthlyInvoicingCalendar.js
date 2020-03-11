import React from "react";
import moment from "moment";

class MonthlyInvoicingCalendar extends React.Component {
    FIRST_YEAR = 2019;

    constructor(props) {
        super(props);
        this.handleMonthChangePrevious = this.handleMonthChangePrevious.bind(this);
        this.handleMonthChangeNext = this.handleMonthChangeNext.bind(this);
        this.handleMonthSelected = this.handleMonthSelected.bind(this);
        this.handleYearSelected = this.handleYearSelected.bind(this);
    }

    handleMonthChangePrevious() {
        const selectedDate = moment()
            .year(this.props.year)
            .month(this.props.month)
            .date(1)
            .add(-1, "month");
        this.props.handleChange(selectedDate.year(), selectedDate.month());
    }

    handleMonthChangeNext() {
        const selectedDate = moment()
            .year(this.props.year)
            .month(this.props.month)
            .date(1)
            .add(1, "month");
        this.props.handleChange(selectedDate.year(), selectedDate.month());
    }

    handleMonthSelected(event) {
        const selectedDate = moment()
            .year(this.props.year)
            .month(event.target.value)
            .date(1);
        this.props.handleChange(selectedDate.year(), selectedDate.month());
    }

    handleYearSelected(event) {
        const selectedDate = moment()
            .year(event.target.value)
            .month(this.props.month)
            .date(1);
        this.props.handleChange(selectedDate.year(), selectedDate.month());
    }

    isPreviousButtonDisabled() {
        const firstMonth = 0;
        const firstYear = this.FIRST_YEAR;
        return firstMonth === this.props.month && firstYear === this.props.year;
    }

    isNextButtonDisabled() {
        const currentMonth = moment().month();
        const currentYear = moment().year();
        return currentMonth === this.props.month && currentYear === this.props.year;
    }

    get monthOptions() {
        return moment.months().map((month, index) => {
            return (
                <option key={index} value={index}>
                    {month.charAt(0).toLocaleUpperCase() + month.slice(1)}
                </option>
            );
        });
    }

    get yearOptions() {
        return Array(moment().year() - (this.FIRST_YEAR - 1))
            .fill(undefined)
            .map((row, index) => {
                const y = this.FIRST_YEAR + index;
                return (
                    <option key={y} value={y}>
                        {y}
                    </option>
                );
            });
    }

    render() {
        const {month, year} = this.props;

        return (
            <div className="text-center">
                <h4 className="mb-3">Hoy es: {moment().format("DD/MM/YYYY")}</h4>
                <form className="form-inline d-flex justify-content-between m-1">
                    <button
                        type="button"
                        className="btn mr-1"
                        onClick={this.handleMonthChangePrevious}
                        disabled={this.isPreviousButtonDisabled()}
                    >
                        &laquo;
                    </button>
                    <div className="row">
                        <select
                            className="custom-select"
                            id="inlineFormCustomSelectPref"
                            value={month}
                            onChange={this.handleMonthSelected}
                        >
                            {this.monthOptions}
                        </select>
                        <select
                            className="custom-select"
                            id="inlineFormCustomSelectPref"
                            value={year}
                            onChange={this.handleYearSelected}
                        >
                            {this.yearOptions}
                        </select>
                    </div>
                    <button
                        type="button"
                        className="btn ml-1"
                        onClick={this.handleMonthChangeNext}
                        disabled={this.isNextButtonDisabled()}
                    >
                        &raquo;
                    </button>
                </form>
            </div>
        );
    }
}

export default MonthlyInvoicingCalendar;
