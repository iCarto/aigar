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
        * o alguna factura tienen estado = pendiente de cobro (es decir, que ya se han impreso)
    */
    const isPrintInvoicesButtonDisabled =
        !invoices?.length ||
        invoices?.some(invoice => !invoice.caudal_actual) ||
        invoices?.some(
            invoice => invoice.estado === ESTADOS_FACTURA.PENDIENTE_DE_COBRO
        );

    /*
        Botón ACTUALIZAR PAGOS deshabilitado cuando:
        * No haya facturas para ese mes
        * o haya al menos una factura con estado = nueva
        * o todas las facturas sean estado = (cobrada o no cobrada)
    */
    // TO-DO: ¿No podría ser que esté deshabilitado cuando no haya ninguna factura PENDIENTE? Esto es lo mismo que si todas las facturas están pagadas o cobradas, y salvamos el caso de que haya alguna factura anulada, por ejemplo.
    const isLoadPaymentsButtonDisabled =
        !invoices?.length ||
        invoices?.some(invoice => invoice.estado === ESTADOS_FACTURA.NUEVA) ||
        invoices?.every(
            invoice =>
                invoice.estado === ESTADOS_FACTURA.COBRADA ||
                invoice.estado === ESTADOS_FACTURA.NO_COBRADA
        );
    // || !invoices?.some(
    //     invoice => invoice.estado === ESTADOS_FACTURA.PENDIENTE_DE_COBRO
    // );

    /*
        Sabemos que el proceso de facturación ha terminado cuando:
        * el botón de imprimir facturas está desactivado (ya se han impreso)
        * Y no hay ninguna factura nueva ni no cobrada (porque entonces estaríamos en el punto 1 o 2 del proceso, iniciar facturación o importar lecturas)
        * PERO ADEMÁS no todas están pendientes de cobro (porque entonces significa que los pagos aún no se han actualizado)
    */
    const isMonthlyInvoicingDone =
        isPrintInvoicesButtonDisabled &&
        !invoices?.some(
            invoice =>
                invoice.estado === ESTADOS_FACTURA.NUEVA ||
                invoice.estado === ESTADOS_FACTURA.NO_COBRADA
        ) &&
        invoices?.some(
            invoice => invoice.estado !== ESTADOS_FACTURA.PENDIENTE_DE_COBRO
        );

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
