import React from "react";

class MonthlyInvoicingListSummary extends React.Component {
    render() {
        return (
            <div>
                Mostrando <strong>{this.props.filteredInvoicesLength}</strong> de{" "}
                {this.props.invoicesLength} facturas
            </div>
        );
    }
}

export default MonthlyInvoicingListSummary;
