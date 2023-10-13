import {useMemo} from "react";
import {ESTADOS_FACTURA} from "invoice/model";

function useButtonDisablingLogic(invoices, invoicingMonths, selectedInvoicingMonth) {
    const isNewMonthSelected = selectedInvoicingMonth?.id_mes_facturacion === -1;
    const isCurrentInvoicingMonthSelected = selectedInvoicingMonth?.is_open;

    // ------- Sidebar buttons ------- //

    const isStartInvoicingDisabled = !isNewMonthSelected;

    /*
        Botón 2. IMPORTAR LECTURAS deshabilitado cuando:
        * No haya facturas para ese mes (que sería el caso de que has cambiado el selector de mes y no has iniciado la facturación)
        * o cuando todas las facturas tengan un caudal_actual > 0. No usamos el consumo porque podría ser 0 por cualquier motivo
        * o cuando ya se hayan impreso las facturas (es decir, que no todas las facturas son nuevas)
    */
    const isLoadMeasurementsButtonDisabled = useMemo(() => {
        return (
            !invoices?.length ||
            invoices?.every(invoice => invoice.caudal_actual) ||
            invoices?.some(invoice => invoice.estado !== ESTADOS_FACTURA.NUEVA)
        );
    }, [invoices]);

    /*
        Botón 3. IMPRIMIR FACTURAS deshabilitado cuando:
        * No haya facturas para ese mes
        * o alguna factura no tenga caudal_actual o es 0. Es decir no se ha importado la lectura para alguna.
        * o alguna factura tienen estado = pendiente de cobro (es decir, que ya se han impreso)
    */
    const isPrintInvoicesButtonDisabled = useMemo(() => {
        return (
            !invoices?.length ||
            invoices?.some(invoice => !invoice.caudal_actual) ||
            invoices?.some(
                invoice => invoice.estado === ESTADOS_FACTURA.PENDIENTE_DE_COBRO
            )
        );
    }, [invoices]);

    /*
        Botón 5. ACTUALIZAR PAGOS deshabilitado cuando:
        * No haya facturas para ese mes
        * o haya al menos una factura con estado = nueva
        * o todas las facturas sean estado = (cobrada o no cobrada)
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
        * el botón de imprimir facturas está desactivado (ya se han impreso)
        * Y no hay ninguna factura nueva ni no cobrada (porque entonces estaríamos en el punto 1 o 2 del proceso, iniciar facturación o importar lecturas)
        * PERO ADEMÁS no todas están pendientes de cobro (porque entonces significa que los pagos aún no se han actualizado)
    */
    const isMonthlyInvoicingDone = useMemo(() => {
        return (
            isPrintInvoicesButtonDisabled &&
            !invoices?.some(
                invoice =>
                    invoice.estado === ESTADOS_FACTURA.NUEVA ||
                    invoice.estado === ESTADOS_FACTURA.NO_COBRADA
            ) &&
            invoices?.some(
                invoice => invoice.estado !== ESTADOS_FACTURA.PENDIENTE_DE_COBRO
            )
        );
    }, [invoices, isPrintInvoicesButtonDisabled]);

    // ------- Navigator buttons ------- //

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
