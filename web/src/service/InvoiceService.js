import DatabaseFixture from "fixtures/database.json";
import {createInvoices, invoices_api_adapter} from "model";

const InvoiceService = {
    getInvoices(filter) {
        console.log({filter});
        return Promise.resolve(DatabaseFixture).then(d => {
            const invoices = createInvoices(invoices_api_adapter(d["invoices"]));
            return invoices.filter(invoice => {
                var filtered = true;
                if (filter) {
                    if (filter.year) {
                        filtered = invoice.anho === filter.year;
                    }
                    if (filter.month != null) {
                        filtered =
                            filtered && invoice.mes_facturado === filter.month + 1;
                    }
                    if (filter.numero != null) {
                        filtered =
                            filtered && invoice.numero.indexOf(filter.numero) >= 0;
                    }
                    if (filter.nombre != null) {
                        filtered =
                            filtered && invoice.nombre.indexOf(filter.nombre) >= 0;
                    }
                    if (filter.sector != null) {
                        filtered =
                            filtered && invoice.sector === parseInt(filter.sector);
                    }
                }
                return filtered;
            });
        });
    },
    getInvoice(num_factura) {
        return Promise.resolve(DatabaseFixture).then(d => {
            let invoices = invoices_api_adapter(d["invoices"]);
            invoices = createInvoices(invoices);
            return invoices.getInvoice(num_factura);
        });
    },
};

export default InvoiceService;
