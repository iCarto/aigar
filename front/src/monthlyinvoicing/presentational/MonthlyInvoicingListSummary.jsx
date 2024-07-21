const MonthlyInvoicingListSummary = ({filteredInvoicesLength, invoicesLength}) => {
    return (
        <div>
            Mostrando <strong>{filteredInvoicesLength}</strong> de {invoicesLength}{" "}
            recibos
        </div>
    );
};

export default MonthlyInvoicingListSummary;
