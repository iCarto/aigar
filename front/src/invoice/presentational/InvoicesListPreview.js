import {useState} from "react";
import {SortedTable, LinkCellTable} from "base/table/components";
import {Spinner} from "base/common";
import {InvoiceStatusCellTable} from "invoice/presentational";
import {MemberViewModal} from "member/presentational";

const InvoicesListPreview = ({invoices, invoicesTableType}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMemberForModal, setSelectedMemberForModal] = useState(null);

    const handleClickViewMember = num_socio => {
        setIsModalOpen(true);
        setSelectedMemberForModal(num_socio);
    };

    const onClickCancelViewMember = () => {
        setIsModalOpen(false);
        setSelectedMemberForModal(null);
    };

    const modal = (
        <MemberViewModal
            num_socio={selectedMemberForModal}
            isOpen={isModalOpen}
            onClose={onClickCancelViewMember}
        />
    );

    if (invoices.length) {
        const columns = [
            {
                Header: "Socio",
                accessor: d => `${d.num_socio} - ${d.nombre}`,
                Cell: LinkCellTable,
                getProps: () => ({
                    handleClickWithItem: handleClickViewMember,
                    linkAccessor: "num_socio",
                }),
            },
            {
                Header: "Sector",
                accessor: "sector",
            },
            {
                Header: "Número factura",
                accessor: "numero",
            },
        ];
        if (invoicesTableType === "measurements") {
            columns.push(
                {
                    Header: "Lectura anterior",
                    accessor: "caudal_anterior",
                    className: "cubic-metre",
                },
                {
                    Header: "Lectura actual",
                    accessor: "caudal_actual",
                    className: "cubic-metre",
                },
                {
                    Header: "Consumo",
                    accessor: "consumo",
                    className: "cubic-metre font-weight-bold",
                },
                {
                    Header: "Cuota fija",
                    accessor: "cuota_fija",
                    className: "dollar",
                },
                {
                    Header: "Cuota variable",
                    accessor: "cuota_variable",
                    className: "dollar",
                },
                {
                    Header: "Saldo pendiente",
                    accessor: "saldo_pendiente",
                    className: "dollar",
                },
                {
                    Header: "Total factura",
                    accessor: "total",
                    className: "dollar font-weight-bold",
                }
            );
        }
        if (invoicesTableType === "payments") {
            columns.push(
                {
                    Header: "Consumo",
                    accessor: "consumo",
                    className: "cubic-metre font-weight-bold",
                },
                {
                    Header: "Pago 1 al 15",
                    accessor: "pago_1_al_10",
                    className: "dollar",
                },
                {
                    Header: "Pago 16 al 30",
                    accessor: "pago_11_al_30",
                    className: "dollar",
                },
                {
                    Header: "Total factura",
                    accessor: "total",
                    className: "dollar font-weight-bold",
                },
                {
                    Header: "Estado",
                    accessor: "estado",
                    Cell: InvoiceStatusCellTable,
                }
            );
        }
        columns.push({
            Header: "Alertas",
            accessor: "errors",
            className: "text-danger small",
        });

        return (
            <>
                <div
                    className="overflow-auto border rounded"
                    style={{maxHeight: "450px"}}
                >
                    <SortedTable
                        columns={columns}
                        data={invoices}
                        onUpdateData={undefined}
                    />
                </div>
                {modal}
            </>
        );
    }
    return <Spinner message="Obteniendo facturas" />;
};

export default InvoicesListPreview;
