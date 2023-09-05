import {MEMBER_TYPES} from "member/model/Member";
import {ActionsSidebarMenu} from "base/ui/menu/components";
import {EditButton} from "base/common";
import {CreateInvoiceButton} from "invoice/presentational";
import {ConnectMemberButton, DeleteMemberButton, DisconnectMemberButton} from ".";

const MemberPageSidebar = ({member, onUpdateStatus}) => {
    const memberStatus = member.status;
    const isMemberDeleted = memberStatus === MEMBER_TYPES.DELETED.key;
    const isMemberInactive = memberStatus === MEMBER_TYPES.INACTIVE.key;

    const menuActions = [
        <EditButton disabled={isMemberDeleted || isMemberInactive} />,
        <CreateInvoiceButton disabled={isMemberDeleted} />,
        isMemberInactive ? (
            <ConnectMemberButton member={member} onUpdateStatus={onUpdateStatus} />
        ) : null,
        !isMemberInactive && !isMemberDeleted ? (
            <DisconnectMemberButton member={member} onUpdateStatus={onUpdateStatus} />
        ) : null,
        !isMemberDeleted ? (
            <DeleteMemberButton member={member} onUpdateStatus={onUpdateStatus} />
        ) : null,
    ];

    return (
        <ActionsSidebarMenu
            menuActions={menuActions}
            showBackButton
            urlPathBack="/socios"
        />
    );
};

export default MemberPageSidebar;
