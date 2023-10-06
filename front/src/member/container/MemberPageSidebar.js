import {MEMBER_TYPES} from "member/config";
import {ActionsSidebarMenu} from "base/ui/menu/components";
import {EditButton} from "base/common";
import {CreateInvoiceButton} from "invoice/presentational";
import {ConnectMemberButton, DeleteMemberButton, DisconnectMemberButton} from ".";

const MemberPageSidebar = ({member, onUpdateStatus}) => {
    const memberStatus = member.status;

    const isMemberInactive = memberStatus === MEMBER_TYPES.INACTIVE.key;

    const menuActions = [
        <EditButton disabled={member.isDeleted || isMemberInactive} />,
        <CreateInvoiceButton disabled={member.isDeleted} />,
        isMemberInactive ? (
            <ConnectMemberButton member={member} onUpdateStatus={onUpdateStatus} />
        ) : null,
        !isMemberInactive && !member.isDeleted ? (
            <DisconnectMemberButton member={member} onUpdateStatus={onUpdateStatus} />
        ) : null,
        !member.isDeleted ? (
            <DeleteMemberButton member={member} onUpdateStatus={onUpdateStatus} />
        ) : null,
    ];

    return <ActionsSidebarMenu menuActions={menuActions} showBackButton />;
};

export default MemberPageSidebar;
