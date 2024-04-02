import {useMemo} from "react";
import {ESTADOS_FACTURA} from "invoice/model";

function useButtonDisablingLogic(invoices, invoicingMonths, selectedInvoicingMonth) {
    const isNewMonthSelected = selectedInvoicingMonth?.id_mes_facturacion === -1;
    const isCurrentInvoicingMonthSelected = selectedInvoicingMonth?.is_open;

    // ------- Sidebar buttons ------- //

    const isStartInvoicingDisabled = !isNewMonthSelected;

    /*
        Botón 2. IMPORTAR LECTURAS deshabilitado cuando:
        * No haya recibos para ese mes (que sería el caso de que has cambiado el selector de mes y no has iniciado la facturación)
        * o cuando todas los recibos tengan una lectura asociada.
        * o cuando ya se hayan impreso los recibos (es decir, que no todas los recibos son nuevos)
    */
    const isLoadMeasurementsButtonDisabled = useMemo(() => {
        return (
            !invoices?.length ||
            invoices?.every(invoice => invoice.hasMeasurement) ||
            invoices?.some(invoice => invoice.estado !== ESTADOS_FACTURA.NUEVA)
        );
    }, [invoices]);

    /*
        Botón 3. IMPRIMIR RECIBOS deshabilitado cuando:
        * No haya recibos para ese mes
        * o algún recibo no tenga una lectura asociada
    */
    const isPrintInvoicesButtonDisabled = useMemo(() => {
        return !invoices?.length || invoices?.some(invoice => !invoice.hasMeasurement);
    }, [invoices]);

    /*
        Botón 5. ACTUALIZAR PAGOS deshabilitado cuando:
        * No haya recibos para ese mes
        * o haya al menos un recibo con estado = nueva
        * o todas los recibos sean estado = (cobrada o no cobrada)
    */
    const isLoadPaymentsButtonDisabled = useMemo(() => {
        return (
            !invoices?.length ||
            invoices?.some(invoice => invoice.estado === ESTADOS_FACTURA.NUEVA) ||
            invoices?.every(
                invoice =>
                    invoice.estado === ESTADOS_FACTURA.COBRADA ||
                    invoice.estado === ESTADOS_FACTURA.NO_COBRADA
            )
        );
    }, [invoices]);

    /*
        Sabemos que el proceso de facturación ha terminado cuando:
        * Y no hay ningún recibo nueva ni no cobrada (porque entonces estaríamos en el punto 1 o 2 del proceso, iniciar proceso o importar lecturas)
        * PERO ADEMÁS no todas están pendientes de cobro (porque entonces significa que los pagos aún no se han actualizado)
    */
    const isMonthlyInvoicingDone = useMemo(() => {
        return (
            !invoices?.some(
                invoice =>
                    invoice.estado === ESTADOS_FACTURA.NUEVA ||
                    invoice.estado === ESTADOS_FACTURA.NO_COBRADA
            ) &&
            invoices?.some(
                invoice => invoice.estado !== ESTADOS_FACTURA.PENDIENTE_DE_COBRO
            )
        );
    }, [invoices]);

    // ------- Month navigator buttons ------- //

    const getInvoicingMonthCurrentIndex = () => {
        return invoicingMonths.findIndex(
            invoicingMonth =>
                invoicingMonth.mes === selectedInvoicingMonth.mes &&
                invoicingMonth.anho === selectedInvoicingMonth.anho
        );
    };

    const isLastMonthOptionDisabled = useMemo(() => {
        if (!selectedInvoicingMonth) {
            return true;
        }
        return selectedInvoicingMonth?.is_open && !isMonthlyInvoicingDone;
    }, [invoicingMonths, isMonthlyInvoicingDone]);

    const isPreviousMonthButtonDisabled = getInvoicingMonthCurrentIndex() === 0;

    const isNextMonthButtonDisabled =
        (isCurrentInvoicingMonthSelected && !isMonthlyInvoicingDone) ||
        getInvoicingMonthCurrentIndex() === invoicingMonths.length - 1;

    return {
        isStartInvoicingDisabled,
        isLoadMeasurementsButtonDisabled,
        isPrintInvoicesButtonDisabled,
        isLoadPaymentsButtonDisabled,
        isMonthlyInvoicingDone,
        isLastMonthOptionDisabled,
        isNextMonthButtonDisabled,
        isPreviousMonthButtonDisabled,
    };
}

export {useButtonDisablingLogic};
