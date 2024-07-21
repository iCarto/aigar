import {useState} from "react";
import {useInvoicesPreviewTableColumns} from "invoice/data/InvoicesPreviewTableColumns";
import {SortedEditableTable} from "base/table/components";
import {MemberViewModal} from "member/presentational";
import Box from "@mui/material/Box";

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

    const isInvoicesWithErrors = invoices.some(invoice => invoice.errors.length);

    const {tableColumns} = useInvoicesPreviewTableColumns(
        handleClickViewMember,
        invoicesTableType,
        isInvoicesWithErrors
    );

    const modal = (
        <MemberViewModal
            id={selectedMemberForModal}
            isOpen={isModalOpen}
            onClose={onClickCancelViewMember}
        />
    );

    return invoices.length ? (
        <Box sx={{overflow: "auto", maxHeight: "450px"}}>
            <SortedEditableTable columns={tableColumns} data={invoices} />
            {modal}
        </Box>
    ) : null;
};

export default InvoicesListPreview;
