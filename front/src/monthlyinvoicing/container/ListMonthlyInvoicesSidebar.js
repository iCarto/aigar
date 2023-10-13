import {MonthlyInvoicingNavigator} from "../presentational";
import {ActionsSidebarMenu} from "base/ui/menu/components";
import {
    ExportMemberButton,
    LoadMeasurementsButton,
    LoadPaymentsButton,
    PrintInvoicesButton,
    StartInvoicingMonthButton,
} from "./actions";

const ListMonthlyInvoicesSidebar = ({
    invoices,
    invoicingMonths,
    selectedInvoicingMonth,
    buttonDisableRules,
    handleChangeInvoicingMonth,
    handleDataUpdate,
}) => {
    const outputFilename = `recibo_${selectedInvoicingMonth.anho}_${selectedInvoicingMonth.mes}_todos`;

    const isCurrentInvoicingMonthSelected = selectedInvoicingMonth?.is_open;
    const isNewMonthSelected = selectedInvoicingMonth?.id_mes_facturacion === -1;

    const menuActions = [
        <StartInvoicingMonthButton
            invoicingMonth={selectedInvoicingMonth}
            disabled={buttonDisableRules?.isStartInvoicingDisabled}
        />,
        <LoadMeasurementsButton
            invoicingMonth={selectedInvoicingMonth}
            disabled={buttonDisableRules?.isLoadMeasurementsButtonDisabled}
        />,
        <PrintInvoicesButton
            buttonTitle="3. Imprimir facturas"
            showIcon={false}
            invoices={invoices}
            outputFilename={outputFilename}
            onDataUpdate={handleDataUpdate}
            disabled={buttonDisableRules?.isPrintInvoicesButtonDisabled}
        />,
        <ExportMemberButton />,
        <LoadPaymentsButton
            invoicingMonth={selectedInvoicingMonth}
            disabled={buttonDisableRules?.isLoadPaymentsButtonDisabled}
        />,
    ];

    return (
        <>
            <MonthlyInvoicingNavigator
                selectedInvoicingMonth={selectedInvoicingMonth}
                invoicingMonths={invoicingMonths}
                handleChangeInvoicingMonth={handleChangeInvoicingMonth}
                buttonDisableRules={buttonDisableRules}
            />
            {isCurrentInvoicingMonthSelected || isNewMonthSelected ? (
                <ActionsSidebarMenu menuActions={menuActions} />
            ) : null}
        </>
    );
};

export default ListMonthlyInvoicesSidebar;
