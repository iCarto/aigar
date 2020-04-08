import {createInvoices} from "./Invoice";

class InvoicingMonths extends Array {}

const invoicing_month_api_adapter = invoicing_month => {
    /*if (invoicing_month.invoices) {
        invoicing_month["invoices"] = invoices_api_adapter(invoicing_month.invoices);
    }*/
    return invoicing_month;
};

const invoicing_months_api_adapter = invoicing_months => {
    return invoicing_months.map(invoicing_month => {
        invoicing_month = invoicing_month_api_adapter(invoicing_month);
        return invoicing_month;
    });
};

const createInvoicingMonths = (data = []) => {
    const invoices = InvoicingMonths.from(data, invoice => {
        return createInvoicingMonth(invoice);
    });
    return invoices;
};

const createInvoicingMonth = ({
    id_mes_facturacion = -1,
    anho = "",
    mes = "",
    is_open = false,
    invoices = [],
} = {}) => {
    const publicApi = {
        id_mes_facturacion,
        anho: anho.toString(),
        mes: mes.toString().padStart(2, "0"),
        is_open,
        invoices: createInvoices(invoices),
    };

    return Object.freeze(publicApi);
};

export {
    createInvoicingMonth as default,
    invoicing_month_api_adapter,
    createInvoicingMonths,
    invoicing_months_api_adapter,
};
