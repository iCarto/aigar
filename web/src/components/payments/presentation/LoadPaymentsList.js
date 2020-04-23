import React from "react";
import {
    SortedTable,
    EditableTextCellTable,
    EditableDateCellTable,
    LinkCellTable,
} from "components/common/table";
import {MemberViewModal} from "components/member/presentation";

class LoadPaymentsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMemberModal: null,
            selectedMemberForModal: null,
        };
        this.handleClickViewMember = this.handleClickViewMember.bind(this);
        this.onClickCancelViewMember = this.onClickCancelViewMember.bind(this);
    }

    handleClickViewMember(num_socio) {
        this.setState({
            showMemberModal: true,
            selectedMemberForModal: num_socio,
        });
    }

    onClickCancelViewMember() {
        this.setState({
            showMemberModal: null,
            selectedMemberForModal: null,
        });
    }

    get modal() {
        return (
            <MemberViewModal
                num_socio={this.state.selectedMemberForModal}
                showModal={this.state.showMemberModal}
                onClickCancel={this.onClickCancelViewMember}
            />
        );
    }

    render() {
        if (this.props.payments) {
            const columns = [
                {
                    Header: "Socio",
                    accessor: d => `${d.num_socio} - ${d.nombre_socio}`,
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
                },
            ];

            return (
                <>
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
                    {this.modal}
                </>
            );
        }
        return null;
    }
}

export default LoadPaymentsList;
