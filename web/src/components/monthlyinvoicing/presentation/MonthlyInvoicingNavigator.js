import React from "react";
import {DateUtil} from "components/util";

class MonthlyInvoicingNavigator extends React.Component {
    constructor(props) {
        super(props);
        this.handleMonthChangePrevious = this.handleMonthChangePrevious.bind(this);
        this.handleMonthChangeNext = this.handleMonthChangeNext.bind(this);
        this.handleMonthSelected = this.handleMonthSelected.bind(this);
        this.handleYearSelected = this.handleYearSelected.bind(this);
    }

    getInvoicingMonthCurrentIndex() {
        return this.props.invoicingMonths.findIndex(
            invoicingMonth =>
                invoicingMonth.mes === this.props.selectedInvoicingMonth.mes &&
                invoicingMonth.anho === this.props.selectedInvoicingMonth.anho
        );
    }

    handleMonthChangePrevious() {
        this.props.handleChangeInvoicingMonth(
            this.props.invoicingMonths[this.getInvoicingMonthCurrentIndex() - 1]
        );
    }

    handleMonthChangeNext() {
        this.props.handleChangeInvoicingMonth(
            this.props.invoicingMonths[this.getInvoicingMonthCurrentIndex() + 1]
        );
    }

    handleMonthSelected(event) {
        const month = event.target.value;
        const newSelectedInvoicingMonth = this.props.invoicingMonths.find(
            invoicingMonth =>
                invoicingMonth.mes === month &&
                invoicingMonth.anho === this.props.selectedInvoicingMonth.anho
        );
        this.props.handleChangeInvoicingMonth(newSelectedInvoicingMonth);
    }

    handleYearSelected(event) {
        const year = event.target.value;
        let newSelectedInvoicingMonth = this.props.invoicingMonths.find(
            invoicingMonth =>
                invoicingMonth.mes === this.props.selectedInvoicingMonth.mes &&
                invoicingMonth.anho === year
        );
        // If the month for selected year doesn't exist, the first month of year is selected
        if (!newSelectedInvoicingMonth) {
            newSelectedInvoicingMonth = this.props.invoicingMonths.find(
                invoicingMonth => invoicingMonth.anho === year
            );
        }
        this.props.handleChangeInvoicingMonth(newSelectedInvoicingMonth);
    }

    isPreviousButtonDisabled() {
        return this.getInvoicingMonthCurrentIndex() === 0;
    }

    isNextButtonDisabled() {
        return (
            this.getInvoicingMonthCurrentIndex() ===
            this.props.invoicingMonths.length - 1
        );
    }

    get monthOptions() {
        const selectedYear = this.props.selectedInvoicingMonth.anho;
        const months = this.props.invoicingMonths
            .filter(invoicingMonth => invoicingMonth.anho === selectedYear)
            .map(invoicingMonth => invoicingMonth.mes);
        return months.map(month => {
            return (
                <option key={month} value={month}>
                    {DateUtil.getMonthName(month)}
                </option>
            );
        });
    }

    get yearOptions() {
        const years = this.props.invoicingMonths.map(
            invoicingMonth => invoicingMonth.anho
        );
        const yearsWithoutRepeated = [...new Set(years)];
        return yearsWithoutRepeated.map(year => {
            return (
                <option key={year} value={year}>
                    {year}
                </option>
            );
        });
    }

    render() {
        return (
            <div className="text-center">
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
                            value={this.props.selectedInvoicingMonth.mes}
                            onChange={this.handleMonthSelected}
                        >
                            {this.monthOptions}
                        </select>
                        <select
                            className="custom-select"
                            id="inlineFormCustomSelectPref"
                            value={this.props.selectedInvoicingMonth.anho}
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

export default MonthlyInvoicingNavigator;
