class InvoicingMonths extends Array {}

const invoicing_month_api_adapter = invoicing_month => {
    return invoicing_month;
};

const invoicing_months_api_adapter = invoicing_months => {
    return invoicing_months.map(invoicing_month => {
        invoicing_month = invoicing_month_api_adapter(invoicing_month);
        return invoicing_month;
    });
};

const createInvoicingMonths = (data = []) => {
    const invoicingMonths = InvoicingMonths.from(data, invoicingMonth => {
        return createInvoicingMonth(invoicingMonth);
    });
    return invoicingMonths;
};

const createInvoicingMonth = ({
    id_mes_facturacion = -1,
    anho = "",
    mes = "",
    is_open = undefined,
} = {}) => {
    const publicApi = {
        id_mes_facturacion,
        anho: anho.toString(),
        mes: mes.toString().padStart(2, "0"),
        is_open,
    };

    return Object.freeze(publicApi);
};

export {
    createInvoicingMonth as default,
    invoicing_month_api_adapter,
    createInvoicingMonths,
    invoicing_months_api_adapter,
};
