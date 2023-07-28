const MonthlyInvoicingListSummary = ({filteredInvoicesLength, invoicesLength}) => {
    return (
        <div>
            Mostrando <strong>{filteredInvoicesLength}</strong> de {invoicesLength}{" "}
            facturas
        </div>
    );
};

export default MonthlyInvoicingListSummary;
