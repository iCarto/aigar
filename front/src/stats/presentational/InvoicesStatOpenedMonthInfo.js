import {NumberUtil} from "base/format/utilities";

const InvoicesStatOpenedMonthInfo = ({invoices}) => {
    const debt = invoices
        .filter(invoice => invoice["mes_abierto"])
        .reduce((total, invoice) => {
            return total + invoice["deuda"];
        }, 0);
    const monto = invoices
        .filter(invoice => invoice["mes_abierto"])
        .reduce((total, invoice) => {
            return total + invoice["monto"];
        }, 0);
    const total = invoices
        .filter(invoice => invoice["mes_abierto"])
        .reduce((total, invoice) => {
            return total + invoice["total"];
        }, 0);
    return (
        <div className="d-flex justify-content-center">
            <div className="alert alert-secondary mb-0">
                <span>Facturación del mes abierto:</span>
                <ul className="mb-0">
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
};

export default InvoicesStatOpenedMonthInfo;
