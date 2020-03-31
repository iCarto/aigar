import {
    createInvoicingMonth,
    createInvoicingMonths,
    invoicing_months_api_adapter,
    invoicing_month_api_adapter,
} from "model";
import ApiService from "./ApiService";

const InvoicingMonthService = {
    getNextInvoicingMonthToCreate(invoicingMonth) {
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
    },

    getInvoicingMonths() {
        console.log("ApiService.getInvoicingMonths");
        return ApiService.get("/invoicingmonths/").then(response => {
            // For front-end purposes we always add a new empty invoicing month
            // at the end of the array to allow the creation of a new invoicing month
            let invoicingMonths = createInvoicingMonths(
                invoicing_months_api_adapter(response)
            );
            const invoicingMonthOpened = invoicingMonths.find(
                invoicingMonth => invoicingMonth.is_open
            );
            invoicingMonths.push(
                this.getNextInvoicingMonthToCreate(invoicingMonthOpened)
            );
            return invoicingMonths;
        });
    },

    getInvoicingMonth(id_mes_facturacion) {
        return ApiService.get("/invoicingmonths/" + id_mes_facturacion + "/").then(
            response => {
                return createInvoicingMonth(invoicing_month_api_adapter(response));
            }
        );
    },

    startInvoicingMonth(invoicingMonth) {
        return ApiService.post("/invoicingmonths/", invoicingMonth).then(response => {
            return createInvoicingMonth(invoicing_month_api_adapter(response));
        });
    },

    previewInvoicingMonth(invoicingMonth) {
        return ApiService.post(
            "/invoicingmonths/" + invoicingMonth.id_mes_facturacion + "/preview",
            invoicingMonth
        ).then(response => {
            return createInvoicingMonth(invoicing_month_api_adapter(response));
        });
    },

    updateInvoicingMonth(invoicingMonth) {
        return ApiService.patch(
            "/invoicingmonths/" + invoicingMonth.id_mes_facturacion + "/",
            invoicingMonth
        ).then(response => {
            return createInvoicingMonth(invoicing_month_api_adapter(response));
        });
    },
};

export default InvoicingMonthService;
