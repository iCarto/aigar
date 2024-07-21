import {MEMBER_TYPES} from "member/config";
import {ActionsSidebarMenu} from "base/ui/menu/components";
import {EditButton} from "base/ui/buttons/components";
import {CreateInvoiceButton} from "invoice/presentational";
import {ConnectMemberButton, DeleteMemberButton, DisconnectMemberButton} from ".";

const MemberPageSidebar = ({member, onUpdateStatus}) => {
    const memberStatus = member.status;

    const isMemberInactive = memberStatus === MEMBER_TYPES.INACTIVE.key;

    const menuActions = [
        <EditButton disabled={member.isDeleted || isMemberInactive} />,
        // A new invoice is automatically issued when a new member is created. We no longer allow a new invoice to be created from scratch.
        // <CreateInvoiceButton disabled={member.isDeleted} />,
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
