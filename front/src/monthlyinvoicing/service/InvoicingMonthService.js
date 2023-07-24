import {ApiService} from "base/api/service";
import {createInvoices, invoices_api_adapter} from "invoice/model";
import {createMeasurements, measurements_api_adapter} from "measurement/model";
import {
    createInvoicingMonth,
    createInvoicingMonths,
    invoicing_months_api_adapter,
    invoicing_month_api_adapter,
} from "model";
import {
    payments_api_adapter,
    createPayments,
    payments_front_adapter,
} from "model/Payment";

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

    getInvoicingMonthInvoices(id_mes_facturacion) {
        return ApiService.get(
            "/invoicingmonths/" + id_mes_facturacion + "/invoices/"
        ).then(response => {
            return createInvoices(invoices_api_adapter(response));
        });
    },

    startInvoicingMonth(invoicingMonth) {
        return ApiService.post("/invoicingmonths/", invoicingMonth).then(response => {
            return createInvoicingMonth(invoicing_month_api_adapter(response));
        });
    },

    previewInvoicesWithMeasurements(id_mes_facturacion, measurements) {
        return ApiService.post(
            "/invoicingmonths/" + id_mes_facturacion + "/measurements/previewinvoices",
            measurements
        ).then(response => {
            return createInvoices(invoices_api_adapter(response));
        });
    },

    saveMeasurements(id_mes_facturacion, measurements) {
        return ApiService.post(
            "/invoicingmonths/" + id_mes_facturacion + "/measurements/",
            measurements
        ).then(response => {
            return createMeasurements(measurements_api_adapter(response));
        });
    },

    previewInvoicesWithPayments(id_mes_facturacion, payments) {
        const paymentsToApi = payments_api_adapter(payments);
        console.log(paymentsToApi);
        return ApiService.post(
            "/invoicingmonths/" + id_mes_facturacion + "/payments/previewinvoices",
            paymentsToApi
        ).then(response => {
            return createInvoices(invoices_api_adapter(response));
        });
    },

    savePayments(id_mes_facturacion, payments) {
        const paymentsToApi = payments_api_adapter(payments);
        return ApiService.post(
            "/invoicingmonths/" + id_mes_facturacion + "/payments/",
            paymentsToApi
        ).then(response => {
            return createPayments(payments_front_adapter(response));
        });
    },
};

export default InvoicingMonthService;
