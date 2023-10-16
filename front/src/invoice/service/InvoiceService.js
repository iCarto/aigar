import {ApiService} from "base/api/service";
import {
    createInvoices,
    invoices_api_adapter,
    invoice_api_adapter,
    createInvoice,
} from "invoice/model";
import {createPayments, payments_api_adapter} from "payment/model";

const InvoiceService = {
    getInvoices() {
        return ApiService.get("/invoices").then(response => {
            return createInvoices(invoices_api_adapter(response));
        });
    },

    getInvoicesForMember(member_id) {
        return ApiService.get("/invoices/?member_id=" + member_id).then(response => {
            return createInvoices(invoices_api_adapter(response));
        });
    },

    getInvoice(id) {
        id = parseInt(id);
        return ApiService.get("/invoices/" + id + "/").then(response => {
            let invoice = invoice_api_adapter(response);
            return createInvoice(invoice);
        });
    },

    getInvoicePayments(id) {
        id = parseInt(id);
        return ApiService.get("/invoices/" + id + "/payments/").then(response => {
            return createPayments(payments_api_adapter(response));
        });
    },

    createInvoice(invoice) {
        return ApiService.post("/invoices/", invoice).then(response => {
            let invoice = invoice_api_adapter(response);
            return createInvoice(invoice);
        });
    },

    updateInvoice(invoice) {
        return ApiService.put("/invoices/" + invoice.id + "/", invoice).then(
            response => {
                let invoice = invoice_api_adapter(response);
                return createInvoice(invoice);
            }
        );
    },

    updateInvoiceTotal(invoice) {
        return ApiService.put("/invoices/" + invoice.id + "/total/", invoice).then(
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

    createNewInvoiceVersion(id) {
        return ApiService.delete("/invoices/" + id + "/").then(response => {
            let invoice = invoice_api_adapter(response);
            return createInvoice(invoice);
        });
    },

    getInvoicesStats() {
        return ApiService.get("/invoices/stats/").then(response => {
            return response;
        });
    },

    addWorkingDayPenaltyPenalty(pks) {
        console.log(pks);
        return ApiService.put("/invoices/value/", {
            pks,
            value: "jornada_trabajo",
        });
    },

    addNonAttendancePenalty(pks) {
        console.log(pks);
        return ApiService.put("/invoices/value/", {
            pks,
            value: "asamblea",
        });
    },
};

export default InvoiceService;
