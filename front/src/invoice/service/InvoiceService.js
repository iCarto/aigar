import {ApiService} from "base/api/service";
import {
    createInvoices,
    invoices_api_adapter,
    invoice_api_adapter,
    createInvoice,
} from "invoice/model";
import {createPayments, payments_front_adapter} from "payment/model";

const InvoiceService = {
    getInvoices() {
        return ApiService.get("/invoices").then(response => {
            return createInvoices(invoices_api_adapter(response));
        });
    },

    getInvoicesByYearAndMonth(year, month) {
        console.log("ApiService.getInvoicesByYearAndMonth");
        // In Javascript, months are zero-based (https://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.4)
        // But our API and model works are one-based months, so we need to transform
        return ApiService.get("/invoices/?year=" + year + "&month=" + month).then(
            response => {
                return createInvoices(invoices_api_adapter(response));
            }
        );
    },

    getInvoicesForMember(num_socio) {
        return ApiService.get("/invoices/?num_socio=" + num_socio).then(response => {
            return createInvoices(invoices_api_adapter(response));
        });
    },

    getInvoice(id_factura) {
        id_factura = parseInt(id_factura);
        return ApiService.get("/invoices/" + id_factura + "/").then(response => {
            let invoice = invoice_api_adapter(response);
            return createInvoice(invoice);
        });
    },

    getInvoicePayments(id_factura) {
        id_factura = parseInt(id_factura);
        return ApiService.get("/invoices/" + id_factura + "/payments/").then(
            response => {
                return createPayments(payments_front_adapter(response));
            }
        );
    },

    createInvoice(invoice) {
        return ApiService.post("/invoices/", invoice).then(response => {
            let invoice = invoice_api_adapter(response);
            return createInvoice(invoice);
        });
    },

    updateInvoice(invoice) {
        return ApiService.put("/invoices/" + invoice.id_factura + "/", invoice).then(
            response => {
                let invoice = invoice_api_adapter(response);
                return createInvoice(invoice);
            }
        );
    },

    updateInvoiceStatus(pks, status) {
        return ApiService.put("/invoices/status/", {
            pks,
            status,
        });
    },

    createNewInvoiceVersion(id_factura) {
        return ApiService.delete("/invoices/" + id_factura + "/").then(response => {
            let invoice = invoice_api_adapter(response);
            return createInvoice(invoice);
        });
    },

    getInvoicesStats() {
        return ApiService.get("/invoices/stats").then(response => {
            return response;
        });
    },
};

export default InvoiceService;
