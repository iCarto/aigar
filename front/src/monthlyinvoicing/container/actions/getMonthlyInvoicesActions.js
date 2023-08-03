import {ESTADOS_FACTURA} from "invoice/model";
import {
    LoadPaymentsButton,
    LoadMeasurementsButton,
    StartInvoicingMonthButton,
    ExportMemberButton,
    PrintInvoicesButton,
} from "monthlyinvoicing/container/actions";

const getMonthlyInvoicesActions = (selectedInvoicingMonth, invoices) => {
    const getOutputFilename = () => {
        return (
            "recibo_" +
            selectedInvoicingMonth.anho +
            "_" +
            selectedInvoicingMonth.mes +
            "_todos"
        );
    };

    const isStartInvoicingEnabled = selectedInvoicingMonth.id_mes_facturacion < 0;

    const isLoadMeasurementsButtonEnabled =
        invoices?.length > 0 &&
        invoices?.filter(invoice => invoice.consumo === "").length !== 0;

    const isLoadPaymentsButtonEnabled =
        invoices?.length > 0 &&
        invoices?.filter(
            invoice => invoice.estado === ESTADOS_FACTURA.PENDIENTE_DE_COBRO
        ).length !== 0;

    const menuActions = [
        <StartInvoicingMonthButton
            invoicingMonth={selectedInvoicingMonth}
            disabled={!isStartInvoicingEnabled}
            // disabled={isStartInvoicingEnabled}
        />,
        <LoadMeasurementsButton
            invoicingMonth={selectedInvoicingMonth}
            // disabled={!isLoadMeasurementsButtonEnabled}
            disabled={isLoadMeasurementsButtonEnabled}
        />,
        <PrintInvoicesButton
            invoices={invoices}
            buttonTitle="3. Imprimir facturas"
            outputFilename={getOutputFilename()}
            showIcon={false}
        />,
        <ExportMemberButton disabled={false} />,
        <LoadPaymentsButton
            invoicingMonth={selectedInvoicingMonth}
            // disabled={!isLoadPaymentsButtonEnabled}
            // disabled={isLoadPaymentsButtonEnabled}
        />,
    ];

    return menuActions;
};

export default getMonthlyInvoicesActions;
