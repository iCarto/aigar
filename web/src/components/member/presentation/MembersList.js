import React from "react";
import {SortedPaginatedTable, LinkCellTable} from "components/common/table";

class MembersList extends React.Component {
    render() {
        console.log("MembersList.render");
        if (this.props.members) {
            const columns = [
                {
                    Header: "Listado de facturación",
                    columns: [
                        {
                            Header: "Número",
                            accessor: "num_socio",
                        },
                        {
                            Header: "Nombre",
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
                            Header: "Solo mecha",
                            accessor: d => {
                                return d.solo_mecha ? "Sí" : "";
                            },
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
                        {
                            Header: "Eliminado",
                            accessor: d => {
                                return !d.is_active ? "Sí" : "";
                            },
                        },
                    ],
                },
            ];

            return (
                <SortedPaginatedTable
                    columns={columns}
                    data={this.props.members}
                    selectedPageIndex={this.props.selectedPageIndex}
                    handleChangePageIndex={this.props.handleChangePageIndex}
                />
            );
        }
        return null;
    }
}

export default MembersList;
