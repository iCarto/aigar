import {useDomain} from "aigar/domain/provider";
import {MonthlyInvoicingNavigator} from "../presentational";
import {ActionsSidebarMenu} from "base/ui/menu/components";
import {
    ExportMemberButton,
    LoadMeasurementsButton,
    LoadPaymentsButton,
    UpdatePaymentsButton,
    PrintInvoicesButton,
    StartInvoicingMonthButton,
} from "./actions";

const ListMonthlyInvoicesSidebar = ({
    selectedInvoices,
    invoicingMonths,
    selectedInvoicingMonth,
    buttonDisableRules,
    handleChangeInvoicingMonth,
    handleDataUpdate,
}) => {
    const {aigarConfig} = useDomain();

    const isCurrentInvoicingMonthSelected = selectedInvoicingMonth?.is_open;
    const isNewMonthSelected = selectedInvoicingMonth?.id_mes_facturacion === -1;

    const outputFilename = `recibos_${selectedInvoicingMonth.anho}_${selectedInvoicingMonth.mes}_${selectedInvoices.length}`;

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
            buttonTitle="3. Imprimir recibos"
            invoices={selectedInvoices}
            outputFilename={outputFilename}
            onDataUpdate={handleDataUpdate}
            showIcon={false}
            disabled={buttonDisableRules?.isPrintInvoicesButtonDisabled}
        />,
        <ExportMemberButton />,
        aigarConfig.payment_csv ? (
            <LoadPaymentsButton
                invoicingMonth={selectedInvoicingMonth}
                disabled={buttonDisableRules?.isLoadPaymentsButtonDisabled}
            />
        ) : (
            <UpdatePaymentsButton
                invoicingMonthId={selectedInvoicingMonth.id_mes_facturacion}
                invoices={selectedInvoices}
                disabled={buttonDisableRules?.isLoadPaymentsButtonDisabled}
            />
        ),
    ];

    return (
        <>
            <MonthlyInvoicingNavigator
                invoicingMonths={invoicingMonths}
                selectedInvoicingMonth={selectedInvoicingMonth}
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
