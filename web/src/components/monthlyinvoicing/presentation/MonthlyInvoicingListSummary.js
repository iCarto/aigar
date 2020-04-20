import React from "react";
import {DateUtil} from "utilities";

class MonthlyInvoicingListSummary extends React.Component {
    render() {
        return (
            <div className="d-flex justify-content-between align-items-end">
                <h3>
                    {DateUtil.getMonthName(this.props.invoicingMonth.mes)} /{" "}
                    {this.props.invoicingMonth.anho}
                </h3>
                <div>
                    Mostrando <strong>{this.props.filteredInvoicesLength}</strong> de{" "}
                    {this.props.invoicesLength} facturas
                </div>
            </div>
        );
    }
}

export default MonthlyInvoicingListSummary;
