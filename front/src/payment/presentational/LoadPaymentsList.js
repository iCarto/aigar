import {useState} from "react";
import {MemberViewModal} from "member/presentational";
import {
    SortedTable,
    EditableTextCellTable,
    EditableDateCellTable,
    LinkAccessorCellTable,
} from "base/table/components";

const LoadPaymentsList = ({payments, onUpdatePayment}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMemberForModal, setSelectedMemberForModal] = useState(null);

    const handleClickViewMember = member_id => {
        setIsModalOpen(true);
        setSelectedMemberForModal(member_id);
    };

    const onClickCancelViewMember = () => {
        setIsModalOpen(false);
        setSelectedMemberForModal(null);
    };

    const modal = (
        <MemberViewModal
            member_id={selectedMemberForModal}
            isOpen={isModalOpen}
            onClose={onClickCancelViewMember}
        />
    );

    if (payments.length) {
        const columns = [
            {
                Header: "Socio",
                accessor: d => `${d.member_id} - ${d.member_name}`,
                Cell: LinkAccessorCellTable,
                getProps: () => ({
                    handleClick: handleClickViewMember,
                    linkAccessor: "member_id",
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
                className: "dollar",
                style: {textAlign: "right"},
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
