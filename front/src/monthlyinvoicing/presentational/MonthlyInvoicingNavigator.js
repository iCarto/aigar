import {DateUtil} from "base/format/utilities";
import {FormSelect} from "base/form";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

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
        .map(invoicingMonth => ({
            key: invoicingMonth.mes,
            value: DateUtil.getShortMonthName(invoicingMonth.mes),
        }));

    const yearOptions = [
        ...new Set(invoicingMonths.map(invoicingMonth => invoicingMonth.anho)),
    ].map(year => ({
        key: year,
        value: year,
    }));

    const arrowBtnStyle = {
        "& .MuiSvgIcon-root": {
            width: "18px",
            height: "18px",
        },
    };

    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" pb={0.5}>
            <IconButton
                onClick={handleMonthChangePrevious}
                disabled={isPreviousButtonDisabled()}
                size="small"
                sx={arrowBtnStyle}
            >
                <ArrowLeftIcon />
            </IconButton>
            <Box display="flex" alignItems="center">
                <FormSelect
                    label="Mes"
                    name="mes"
                    value={selectedInvoicingMonth.mes}
                    options={monthOptions}
                    onChange={handleMonthSelected}
                    smallInput
                />
                <FormSelect
                    label="Año"
                    name="anho"
                    value={selectedInvoicingMonth.anho}
                    options={yearOptions}
                    onChange={handleYearSelected}
                    smallInput
                />
            </Box>
            <IconButton
                onClick={handleMonthChangeNext}
                disabled={isNextButtonDisabled()}
                size="small"
                sx={arrowBtnStyle}
            >
                <ArrowRightIcon />
            </IconButton>
        </Box>
    );
};

export default MonthlyInvoicingNavigator;
