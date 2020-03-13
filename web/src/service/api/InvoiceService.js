import {
    createInvoice,
    invoice_api_adapter,
    createInvoices,
    invoices_api_adapter,
} from "model";
import ApiService from "./ApiService";

const InvoiceService = {
    getInvoices() {
        return ApiService.get("/invoices").then(response => {
            return createInvoices(invoices_api_adapter(response));
        });
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
