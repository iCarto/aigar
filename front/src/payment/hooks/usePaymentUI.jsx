import {useState} from "react";

export const usePaymentUI = () => {
    const [filter, setFilter] = useState({textSearch: "", showOnlyErrors: false});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMemberForModal, setSelectedMemberForModal] = useState(null);

    const handleFilterChange = newFilter => {
        setFilter(prevFilter => ({...prevFilter, ...newFilter}));
    };

    const handleClickViewMember = member_id => {
        setIsModalOpen(true);
        setSelectedMemberForModal(member_id);
    };

    const handleClickCancelViewMember = () => {
        setIsModalOpen(false);
        setSelectedMemberForModal(null);
    };

    return {
        filter,
        handleFilterChange,
        isModalOpen,
        selectedMemberForModal,
        handleClickViewMember,
        handleClickCancelViewMember,
    };
};
