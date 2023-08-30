import {ActionsSidebarMenu} from "base/ui/menu/components";
import {EditButton} from "base/common";
import {ConnectMemberButton, DeleteMemberButton, DisconnectMemberButton} from ".";
import {CreateInvoiceButton} from "invoice/presentational";
import {MEMBER_TYPES} from "member/data";

const MemberPageSidebar = ({member, numInvoices}) => {
    const memberStatus = member.status;

    const displayConnectButton = memberStatus === MEMBER_TYPES.INACTIVE;
    const displayDisconnectButton =
        memberStatus !== MEMBER_TYPES.INACTIVE && memberStatus !== MEMBER_TYPES.DELETED;
    const displayDeleteButton = memberStatus !== MEMBER_TYPES.DELETED;

    const menuActions = [
        <EditButton />,
        <CreateInvoiceButton disabled={!!numInvoices} />,
        displayConnectButton ? <ConnectMemberButton member={member} /> : null,
        displayDisconnectButton ? <DisconnectMemberButton member={member} /> : null,
        displayDeleteButton ? <DeleteMemberButton member={member} /> : null,
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
