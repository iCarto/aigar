import React from "react";
import {SortedPaginatedTable, LinkCellTable} from "components/common/table";

class MembersList extends React.Component {
    filter(members, filter) {
        return members.filter(member => {
            var filtered = true;
            if (filter) {
                if (filter.name) {
                    filtered = member.name.indexOf(filter.name) >= 0;
                }
                if (filter.sector) {
                    filtered = filtered && member.sector === parseInt(filter.sector);
                }
            }
            return filtered;
        });
    }

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
                            Cell: LinkCellTable,
                            getProps: () => ({
                                handleClick: this.props.handleClickViewMember,
                                linkAccessor: "num_socio",
                            }),
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
                    ],
                },
            ];

            return (
                <SortedPaginatedTable
                    columns={columns}
                    data={this.filter(this.props.members, this.props.filter)}
                    selectedPageIndex={this.props.selectedPageIndex}
                    handleChangePageIndex={this.props.handleChangePageIndex}
                />
            );
        }
        return null;
    }
}

export default MembersList;
