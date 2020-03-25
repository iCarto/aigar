import {
    createInvoice,
    invoice_api_adapter,
    createInvoices,
    invoices_api_adapter,
} from "model";
import ApiService from "./ApiService";

const InvoiceService = {
    getInvoicingMonth() {
        console.log("ApiService.getInvoicingMonth");
        return ApiService.get("/invoicing_month").then(response => {
            // In Javascript, months are zero-based (https://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.4)
            // But our API and model works are one-based months, so we need to transform
            return {
                year: response.year,
                month: response.month - 1,
            };
        });
    },

    startInvoicingMonth(invoicingMonth) {
        const invoicingMonthToCreate = Object.assign({}, invoicingMonth, {
            month: invoicingMonth.month + 1,
        });
        return ApiService.post("/invoicing_month", invoicingMonthToCreate).then(
            response => {
                return {
                    year: response.year,
                    month: response.month - 1,
                };
            }
        );
    },

    getInvoices() {
        return ApiService.get("/invoices").then(response => {
            return createInvoices(invoices_api_adapter(response));
        });
    },

    getInvoicesByYearAndMonth(year, month) {
        console.log("ApiService.getInvoicesByYearAndMonth");
        // In Javascript, months are zero-based (https://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.4)
        // But our API and model works are one-based months, so we need to transform
        return ApiService.get("/invoices/?year=" + year + "&month=" + (month + 1)).then(
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
        // always cast numero_socio to int
        id_factura = parseInt(id_factura);
        return ApiService.get("/invoices/" + id_factura + "/").then(response => {
            let invoice = invoice_api_adapter(response);
            return createInvoice(invoice);
        });
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
};

export default InvoiceService;
