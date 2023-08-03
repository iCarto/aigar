import {DateUtil} from "base/format/utilities";
import {IconButtonLink} from "base/common";

const MonthlyInvoicingNavigator = ({
    invoicingMonths,
    selectedInvoicingMonth,
    handleChangeInvoicingMonth,
}) => {
    const getInvoicingMonthCurrentIndex = () => {
        return invoicingMonths.findIndex(
            invoicingMonth =>
                invoicingMonth.mes === selectedInvoicingMonth.mes &&
                invoicingMonth.anho === selectedInvoicingMonth.anho
        );
    };

    const handleMonthChangePrevious = () => {
        handleChangeInvoicingMonth(
            invoicingMonths[getInvoicingMonthCurrentIndex() - 1]
        );
    };

    const handleMonthChangeNext = () => {
        handleChangeInvoicingMonth(
            invoicingMonths[getInvoicingMonthCurrentIndex() + 1]
        );
    };

    const handleMonthSelected = event => {
        const month = event.target.value;
        const newSelectedInvoicingMonth = invoicingMonths.find(
            invoicingMonth =>
                invoicingMonth.mes === month &&
                invoicingMonth.anho === selectedInvoicingMonth.anho
        );
        handleChangeInvoicingMonth(newSelectedInvoicingMonth);
    };

    const handleYearSelected = event => {
        const year = event.target.value;
        let newSelectedInvoicingMonth = invoicingMonths.find(
            invoicingMonth =>
                invoicingMonth.mes === selectedInvoicingMonth.mes &&
                invoicingMonth.anho === year
        );
        // If the month for selected year doesn't exist, the first month of year is selected
        if (!newSelectedInvoicingMonth) {
            newSelectedInvoicingMonth = invoicingMonths.find(
                invoicingMonth => invoicingMonth.anho === year
            );
        }
        handleChangeInvoicingMonth(newSelectedInvoicingMonth);
    };

    const isPreviousButtonDisabled = () => {
        return getInvoicingMonthCurrentIndex() === 0;
    };

    const isNextButtonDisabled = () => {
        return getInvoicingMonthCurrentIndex() === invoicingMonths.length - 1;
    };

    const monthOptions = invoicingMonths
        .filter(invoicingMonth => invoicingMonth.anho === selectedInvoicingMonth.anho)
        .map(invoicingMonth => {
            return (
                <option key={invoicingMonth.mes} value={invoicingMonth.mes}>
                    {DateUtil.getShortMonthName(invoicingMonth.mes)}
                </option>
            );
        });

    const yearOptions = [
        ...new Set(invoicingMonths.map(invoicingMonth => invoicingMonth.anho)),
    ].map(year => {
        return (
            <option key={year} value={year}>
                {year}
            </option>
        );
    });

    return (
        <form className="form-inline d-flex justify-content-around pt-2 pb-1">
            <IconButtonLink
                icon="chevron-circle-left"
                onClick={handleMonthChangePrevious}
                disabled={isPreviousButtonDisabled()}
            />
            <div className="row">
                <select
                    className="custom-select"
                    id="inlineFormCustomSelectPref"
                    value={selectedInvoicingMonth.mes}
                    onChange={handleMonthSelected}
                >
                    {monthOptions}
                </select>
                <select
                    className="custom-select"
                    id="inlineFormCustomSelectPref"
                    value={selectedInvoicingMonth.anho}
                    onChange={handleYearSelected}
                >
                    {yearOptions}
                </select>
            </div>
            <IconButtonLink
                icon="chevron-circle-right"
                onClick={handleMonthChangeNext}
                disabled={isNextButtonDisabled()}
            />
        </form>
    );
};

export default MonthlyInvoicingNavigator;
