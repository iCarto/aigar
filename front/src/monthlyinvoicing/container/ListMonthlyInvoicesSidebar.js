import {ESTADOS_FACTURA} from "invoice/model";
import {useMonthlyInvoicingList} from "monthlyinvoicing/provider";
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
    selectedInvoicingMonth,
    invoicingMonths,
    handleChangeInvoicingMonth,
    invoices,
}) => {
    const {setIsDataUpdated} = useMonthlyInvoicingList();

    const handleDataUpdate = () => {
        setIsDataUpdated(prevState => !prevState);
    };

    const isCurrentInvoicingMonth = selectedInvoicingMonth.is_open;
    const isStartInvoicingEnabled = selectedInvoicingMonth.id_mes_facturacion < 0;

    const outputFilename = `recibo_${selectedInvoicingMonth.anho}_${selectedInvoicingMonth.mes}_todos`;

    const isLoadMeasurementsButtonEnabled =
        invoices?.length > 0 && invoices?.every(invoice => invoice.consumo >= 0);

    const isLoadPaymentsButtonEnabled =
        invoices?.length > 0 &&
        invoices?.filter(
            invoice => invoice.estado === ESTADOS_FACTURA.PENDIENTE_DE_COBRO
        ).length !== 0;

    const menuActions = [
        <StartInvoicingMonthButton
            invoicingMonth={selectedInvoicingMonth}
            disabled={!isStartInvoicingEnabled}
        />,
        <LoadMeasurementsButton
            invoicingMonth={selectedInvoicingMonth}
            disabled={!isLoadMeasurementsButtonEnabled}
        />,
        <PrintInvoicesButton
            buttonTitle="3. Imprimir facturas"
            invoices={invoices}
            onDataUpdate={handleDataUpdate}
            outputFilename={outputFilename}
            showIcon={false}
        />,
        <ExportMemberButton />,
        <LoadPaymentsButton
            invoicingMonth={selectedInvoicingMonth}
            disabled={!isLoadPaymentsButtonEnabled}
        />,
    ];

    return (
        <>
            <MonthlyInvoicingNavigator
                selectedInvoicingMonth={selectedInvoicingMonth}
                invoicingMonths={invoicingMonths}
                handleChangeInvoicingMonth={handleChangeInvoicingMonth}
            />
            {isStartInvoicingEnabled || isCurrentInvoicingMonth ? (
                <ActionsSidebarMenu menuActions={menuActions} />
            ) : null}
        </>
    );
};

export default ListMonthlyInvoicesSidebar;
