import React from "react";
import {SortedTable} from "base/table";

class PaymentsList extends React.Component {
    render() {
        console.log(this.props.payments);
        if (this.props.payments) {
            const columns = [
                {
                    Header: "Fecha",
                    accessor: "fecha",
                },
                {
                    Header: "Monto",
                    accessor: "monto",
                },
            ];

            return (
                <div
                    className="overflow-auto border rounded"
                    style={{maxHeight: "450px"}}
                >
                    <SortedTable columns={columns} data={this.props.payments} />
                </div>
            );
        }
        return null;
    }
}

export default PaymentsList;
