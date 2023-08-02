import {MonthlyInvoicingNavigator} from "../presentational";
import {ActionsSidebarMenu} from "base/ui/menu";
import {getMonthlyInvoicesActions} from "./actions";

const ListMonthlyInvoicesSidebar = ({
    selectedInvoicingMonth,
    invoicingMonths,
    handleChangeInvoicingMonth,
    invoices,
}) => {
    const actions = getMonthlyInvoicesActions(selectedInvoicingMonth, invoices);

    // const handleDateChange = (year, month) => {
    //     handleFilterChange({month, year});
    // };

    const isCurrentInvoicingMonth = selectedInvoicingMonth.is_open;
    const isStartInvoicingEnabled = selectedInvoicingMonth.id_mes_facturacion < 0;

    return (
        <>
            <MonthlyInvoicingNavigator
                selectedInvoicingMonth={selectedInvoicingMonth}
                invoicingMonths={invoicingMonths}
                handleChangeInvoicingMonth={handleChangeInvoicingMonth}
            />
            {isStartInvoicingEnabled || isCurrentInvoicingMonth ? (
                <ActionsSidebarMenu menuActions={actions} />
            ) : null}
        </>
    );
};

export default ListMonthlyInvoicesSidebar;
