import {ApiService} from "base/api/service";
import {createInvoices, invoices_api_adapter} from "invoice/model";
import {
    createMeasurements,
    measurements_api_adapter,
    measurements_view_adapter,
} from "measurement/model";
import {
    createInvoicingMonth,
    createInvoicingMonths,
    invoicing_months_api_adapter,
    invoicing_month_api_adapter,
} from "monthlyinvoicing/model";
import {
    payments_view_adapter,
    createPayments,
    payments_api_adapter,
} from "payment/model";

const InvoicingMonthService = {
    getInvoicingMonths() {
        console.log("ApiService.getInvoicingMonths");
        return ApiService.get("/invoicingmonths/").then(response => {
            // For front-end purposes we always add a new empty invoicing month
            // at the end of the array to allow the creation of a new invoicing month
            let invoicingMonths = createInvoicingMonths(
                invoicing_months_api_adapter(response)
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

    getInvoicingMonthInvoices(id_mes_facturacion, pks = []) {
        const filters = pks.length ? "?id__in=" + pks.join() : "";
        return ApiService.get(
            `/invoicingmonths/${id_mes_facturacion}/invoices/${filters}`
        ).then(response => {
            return createInvoices(invoices_api_adapter(response));
        });
    },

    startInvoicingMonth(invoicingMonth) {
        return ApiService.post("/invoicingmonths/", invoicingMonth).then(response => {
            return createInvoicingMonth(invoicing_month_api_adapter(response));
        });
    },

    previewInvoicesWithMeasurements(measurements) {
        return ApiService.post("/measurements/previewinvoices/", measurements).then(
            response => {
                return createInvoices(invoices_api_adapter(response));
            }
        );
    },

    saveMeasurements(measurements) {
        return ApiService.post(
            "/measurements/",
            measurements_view_adapter(measurements)
        ).then(response => {
            return createMeasurements(measurements_api_adapter(response));
        });
    },

    previewInvoicesWithPayments(payments) {
        return ApiService.post(
            "/payments/previewinvoices/",
            payments_view_adapter(payments)
        ).then(response => {
            return createInvoices(invoices_api_adapter(response));
        });
    },

    savePayments(id_mes_facturacion, payments) {
        const paymentsToApi = payments_view_adapter(payments);
        return ApiService.post(
            "/invoicingmonths/" + id_mes_facturacion + "/payments/",
            paymentsToApi
        ).then(response => {
            return createPayments(payments_api_adapter(response));
        });
    },
};

export default InvoicingMonthService;
