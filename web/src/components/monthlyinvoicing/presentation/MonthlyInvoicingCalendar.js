import React from "react";
import moment from "moment";

class MonthlyInvoicingCalendar extends React.Component {
    FIRST_YEAR = 2019;

    constructor(props) {
        super(props);
        this.state = {
            selectedMonth: null,
            selectedYear: null,
        };
        this.handleMonthChangePrevious = this.handleMonthChangePrevious.bind(this);
        this.handleMonthChangeNext = this.handleMonthChangeNext.bind(this);
        this.handleMonthSelected = this.handleMonthSelected.bind(this);
        this.handleYearSelected = this.handleYearSelected.bind(this);
    }

    static getDerivedStateFromProps(props, prevState) {
        return {
            selectedMonth: props.month,
            selectedYear: props.year,
        };
    }

    handleMonthChangePrevious() {
        const selectedDate = moment()
            .year(this.state.selectedYear)
            .month(this.state.selectedMonth)
            .date(1)
            .add(-1, "month");
        this.props.handleChange(selectedDate.year(), selectedDate.month());
    }

    handleMonthChangeNext() {
        const selectedDate = moment()
            .year(this.state.selectedYear)
            .month(this.state.selectedMonth)
            .date(1)
            .add(1, "month");
        this.props.handleChange(selectedDate.year(), selectedDate.month());
    }

    handleMonthSelected(event) {
        const selectedDate = moment()
            .year(this.state.selectedYear)
            .month(event.target.value)
            .date(1);
        this.props.handleChange(selectedDate.year(), selectedDate.month());
    }

    handleYearSelected(event) {
        const selectedDate = moment()
            .year(event.target.value)
            .month(this.state.selectedMonth)
            .date(1);
        this.props.handleChange(selectedDate.year(), selectedDate.month());
    }

    isPreviousButtonDisabled() {
        const firstMonth = 0;
        const firstYear = this.FIRST_YEAR;
        return (
            firstMonth === this.state.selectedMonth &&
            firstYear === this.state.selectedYear
        );
    }

    isNextButtonDisabled() {
        const currentMonth = moment().month();
        const currentYear = moment().year();
        return (
            currentMonth === this.state.selectedMonth &&
            currentYear === this.state.selectedYear
        );
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
        const {selectedMonth, selectedYear} = this.state;

        return (
            <form className="form-inline d-flex justify-content-between m-3">
                <button
                    type="button"
                    className="btn btn-secondary mr-3"
                    onClick={this.handleMonthChangePrevious}
                    disabled={this.isPreviousButtonDisabled()}
                >
                    &laquo; Mes anterior
                </button>
                <div className="row">
                    <select
                        className="custom-select"
                        id="inlineFormCustomSelectPref"
                        value={selectedMonth}
                        onChange={this.handleMonthSelected}
                    >
                        {this.monthOptions}
                    </select>
                    <label className="">&nbsp;de&nbsp;</label>
                    <select
                        className="custom-select"
                        id="inlineFormCustomSelectPref"
                        value={selectedYear}
                        onChange={this.handleYearSelected}
                    >
                        {this.yearOptions}
                    </select>
                </div>
                <button
                    type="button"
                    className="btn btn-secondary ml-3"
                    onClick={this.handleMonthChangeNext}
                    disabled={this.isNextButtonDisabled()}
                >
                    Mes Siguiente &raquo;
                </button>
            </form>
        );
    }
}

export default MonthlyInvoicingCalendar;
