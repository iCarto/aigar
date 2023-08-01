import {SortedTable} from "base/table";

// TO-DO: Review (unused component)
const PaymentsList = ({payments}) => {
    if (payments) {
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
            <div className="overflow-auto border rounded" style={{maxHeight: "450px"}}>
                <SortedTable columns={columns} data={payments} />
            </div>
        );
    }

    return null;
};

export default PaymentsList;
