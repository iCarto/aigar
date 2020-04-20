import React from "react";
import {
    SortedTable,
    EditableTextCellTable,
    EditableDateCellTable,
    LinkCellTable,
} from "components/common/table";

class LoadPaymentsList extends React.Component {
    constructor(props) {
        super(props);
        this.handleClickViewMember = this.handleClickViewMember.bind(this);
    }

    handleClickViewMember(num_socio) {
        window.open("/socios/" + num_socio, "_blank");
    }

    render() {
        if (this.props.payments) {
            const columns = [
                {
                    Header: "Número",
                    accessor: "num_socio",
                    Cell: LinkCellTable,
                    getProps: () => ({
                        handleClick: this.handleClickViewMember,
                        linkAccessor: "num_socio",
                    }),
                },
                {
                    Header: "Nombre",
                    accessor: "nombre_socio",
                    Cell: LinkCellTable,
                    getProps: () => ({
                        handleClick: this.handleClickViewMember,
                        linkAccessor: "num_socio",
                    }),
                },
                {
                    Header: "Sector",
                    accessor: "sector",
                },
                {
                    Header: "Nº Factura",
                    accessor: "num_factura",
                    Cell: EditableTextCellTable,
                },
                {
                    Header: "Fecha",
                    accessor: "fecha",
                    Cell: EditableDateCellTable,
                },
                {
                    Header: "Monto",
                    accessor: "monto",
                    Cell: EditableTextCellTable,
                },
            ];

            return (
                <div
                    className="overflow-auto border rounded"
                    style={{maxHeight: "450px"}}
                >
                    <SortedTable
                        columns={columns}
                        data={this.props.payments}
                        onUpdateData={this.props.onUpdatePayment}
                    />
                </div>
            );
        }
        return null;
    }
}

export default LoadPaymentsList;
