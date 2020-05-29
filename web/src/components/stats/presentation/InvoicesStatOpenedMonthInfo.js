import React from "react";
import {NumberUtil} from "utilities";

class InvoicesStatOpenedMonthInfo extends React.Component {
    render() {
        const debt = this.props.invoices
            .filter(invoice => invoice["mes_abierto"])
            .reduce((total, invoice) => {
                return total + invoice["deuda"];
            }, 0);
        const monto = this.props.invoices
            .filter(invoice => invoice["mes_abierto"])
            .reduce((total, invoice) => {
                return total + invoice["monto"];
            }, 0);
        const total = this.props.invoices
            .filter(invoice => invoice["mes_abierto"])
            .reduce((total, invoice) => {
                return total + invoice["total"];
            }, 0);
        return (
            <div className="d-flex justify-content-center">
                <div className="alert alert-secondary">
                    <span>Facturación del mes abierto:</span>
                    <ul>
                        <li>
                            Facturación total:{" "}
                            <strong className="dollar">
                                {NumberUtil.formatFloat(total)}
                            </strong>
                        </li>
                        <li>
                            Cobrado:{" "}
                            <strong className="dollar">
                                {NumberUtil.formatFloat(monto)}
                            </strong>
                        </li>
                        <li>
                            Deuda:{" "}
                            <strong className="dollar text-danger">
                                {NumberUtil.formatFloat(debt)}
                            </strong>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default InvoicesStatOpenedMonthInfo;
