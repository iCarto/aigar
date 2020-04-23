import React from "react";
import {
    SortedTable,
    EditableTextCellTable,
    EditableSelectCellTable,
    LinkCellTable,
} from "components/common/table";
import {MemberViewModal} from "components/member/presentation";

class LoadMeasurementsList extends React.Component {
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
        if (this.props.measurements) {
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
                    Header: "Medidor",
                    accessor: "medidor",
                    Cell: EditableTextCellTable,
                },
                {
                    Header: "Cambio medidor",
                    accessor: "cambio_medidor",
                    Cell: EditableSelectCellTable,
                },
                {
                    Header: "Lectura anterior",
                    accessor: "caudal_anterior",
                },
                {
                    Header: "Lectura actual",
                    accessor: "caudal_actual",
                    Cell: EditableTextCellTable,
                },
                {
                    Header: "Consumo",
                    accessor: "consumo",
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
                            data={this.props.measurements}
                            onUpdateData={this.props.onUpdateMeasurement}
                        />
                    </div>
                    {this.modal}
                </>
            );
        }
        return null;
    }
}

export default LoadMeasurementsList;
