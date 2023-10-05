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
    const isNewMonthSelected = selectedInvoicingMonth.id_mes_facturacion === -1;

    const outputFilename = `recibo_${selectedInvoicingMonth.anho}_${selectedInvoicingMonth.mes}_todos`;

    const isStartInvoicingDisabled = !isNewMonthSelected;
    /*
        Botón IMPORTAR LECTURAS deshabilitado cuando:
        * No haya facturas para ese mes (que sería el caso de que has cambiado el selector de mes y no has iniciado la facturación)
        * o cuando todas las facturas tengan un caudal_actual > 0. No usamos el consumo porque podría ser 0 por cualquier motivo
        * o cuando ya se hayan impreso las facturas (es decir, que no todas las facturas son nuevas)
    */
    const isLoadMeasurementsButtonDisabled =
        !invoices?.length ||
        invoices?.every(invoice => invoice.caudal_actual) ||
        invoices?.some(invoice => invoice.estado !== ESTADOS_FACTURA.NUEVA);
    /*
        Botón IMPRIMIR FACTURAS deshabilitado cuando:
        * No haya facturas para ese mes
        * o alguna factura no tenga caudal_actual o es 0. Es decir no se ha importado la lectura para alguna.
    */
    const isPrintInvoicesButtonDisabled =
        !invoices?.length || invoices?.some(invoice => !invoice.caudal_actual);
    /*
        Botón ACTUALIZAR PAGOS deshabilitado cuando:
        * No haya facturas para ese mes
        * o todas las facturas están cobradas
    */
    const isLoadPaymentsButtonDisabled =
        !invoices?.length ||
        invoices?.every(invoice => invoice.estado === ESTADOS_FACTURA.COBRADA);

    const isMonthlyInvoicingDone =
        isLoadMeasurementsButtonDisabled &&
        isPrintInvoicesButtonDisabled &&
        isLoadPaymentsButtonDisabled;

    const isNextMonthButtonDisabled =
        isCurrentInvoicingMonth && !isMonthlyInvoicingDone;

    const menuActions = [
        <StartInvoicingMonthButton
            invoicingMonth={selectedInvoicingMonth}
            disabled={isStartInvoicingDisabled}
        />,
        <LoadMeasurementsButton
            invoicingMonth={selectedInvoicingMonth}
            disabled={isLoadMeasurementsButtonDisabled}
        />,
        <PrintInvoicesButton
            buttonTitle="3. Imprimir facturas"
            invoices={invoices}
            onDataUpdate={handleDataUpdate}
            outputFilename={outputFilename}
            showIcon={false}
            disabled={isPrintInvoicesButtonDisabled}
        />,
        <ExportMemberButton />,
        <LoadPaymentsButton
            invoicingMonth={selectedInvoicingMonth}
            disabled={isLoadPaymentsButtonDisabled}
        />,
    ];

    return (
        <>
            <MonthlyInvoicingNavigator
                selectedInvoicingMonth={selectedInvoicingMonth}
                invoicingMonths={invoicingMonths}
                handleChangeInvoicingMonth={handleChangeInvoicingMonth}
                isNextMonthButtonDisabled={isNextMonthButtonDisabled}
            />
            {isCurrentInvoicingMonth || isNewMonthSelected ? (
                <ActionsSidebarMenu menuActions={menuActions} />
            ) : null}
        </>
    );
};

export default ListMonthlyInvoicesSidebar;
