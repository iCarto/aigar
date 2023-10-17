import {useState} from "react";
import {useInvoicesPreviewTableColumns} from "invoice/data/InvoicesPreviewTableColumns";
import {SortedEditableTable} from "base/table/components";
import {MemberViewModal} from "member/presentational";

const InvoicesListPreview = ({invoices, invoicesTableType}) => {
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

    const {tableColumns} = useInvoicesPreviewTableColumns(
        handleClickViewMember,
        invoicesTableType
    );

    const modal = (
        <MemberViewModal
            id={selectedMemberForModal}
            isOpen={isModalOpen}
            onClose={onClickCancelViewMember}
        />
    );

    return (
        <>
            <SortedEditableTable
                columns={tableColumns}
                data={invoices}
                onUpdateData={undefined}
            />
            {modal}
        </>
    );
};

export default InvoicesListPreview;
