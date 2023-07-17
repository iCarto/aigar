import React from "react";
import {SortedPaginatedTable, LinkCellTable} from "components/common/table";
import MemberStatusCellTable from "./MemberStatusCellTable";

class MembersList extends React.Component {
    render() {
        console.log("MembersList.render");
        if (this.props.members) {
            const columns = [
                {
                    Header: "Número",
                    accessor: "num_socio",
                },
                {
                    Header: "Socio",
                    accessor: "name",
                    Cell: LinkCellTable,
                    getProps: () => ({
                        handleClick: this.props.handleClickViewMember,
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
                },
                {
                    Header: "Tipo de socio",
                    accessor: "tipo_socio",
                    Cell: MemberStatusCellTable,
                    className: "text-nowrap",
                },
                {
                    Header: "Orden",
                    accessor: "orden",
                },
                {
                    Header: "Consumo máximo",
                    accessor: "consumo_maximo",
                },
                {
                    Header: "Consumo reducción fija",
                    accessor: "consumo_reduccion_fija",
                },
            ];

            return (
                <SortedPaginatedTable
                    columns={columns}
                    data={this.props.members}
                    total={this.props.membersLength}
                    listView={this.props.listView}
                    handleChangeListView={this.props.handleChangeListView}
                />
            );
        }
        return null;
    }
}

export default MembersList;
