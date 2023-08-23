import {useState} from "react";
import {MemberViewModal} from "member/presentational";
import {
    SortedTable,
    EditableTextCellTable,
    EditableDateCellTable,
    LinkCellTable,
} from "base/table/components";

const LoadPaymentsList = ({payments, onUpdatePayment}) => {
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

    if (payments.length) {
        const columns = [
            {
                Header: "Socio",
                accessor: d => `${d.num_socio} - ${d.nombre_socio}`,
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
                        data={payments}
                        onUpdateData={onUpdatePayment}
                    />
                </div>
                {modal}
            </>
        );
    }

    return null;
};

export default LoadPaymentsList;
