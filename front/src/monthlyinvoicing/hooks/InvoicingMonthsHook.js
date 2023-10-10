import {createInvoicingMonth} from "monthlyinvoicing/model";

function useInvoicingMonths() {
    function getNextInvoicingMonth(invoicingMonth) {
        let nextInvocingMonthMonth = parseInt(invoicingMonth.mes) + 1;
        let nextInvocingMonthYear = parseInt(invoicingMonth.anho);
        if (nextInvocingMonthMonth > 12) {
            nextInvocingMonthMonth = 1;
            nextInvocingMonthYear += 1;
        }
        return createInvoicingMonth({
            mes: nextInvocingMonthMonth,
            anho: nextInvocingMonthYear,
        });
    }

    function getCurrentInvoicingMonth(invoicingMonths) {
        const currentInvoicingMonth = invoicingMonths?.find(
            invoicingMonth => invoicingMonth.is_open
        );
        return currentInvoicingMonth;
    }

    function sortInvoicingMonths(invoicingMonths) {
        return invoicingMonths?.sort(
            (a, b) => b.id_mes_facturacion - a.id_mes_facturacion
        );
    }

    return {
        getNextInvoicingMonth,
        getCurrentInvoicingMonth,
        sortInvoicingMonths,
    };
}

export {useInvoicingMonths};
