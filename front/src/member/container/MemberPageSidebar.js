import {ActionsSidebarMenu} from "base/ui/menu";
import {EditButton} from "base/common";
import {ConnectMemberButton, DeleteMemberButton, DisconnectMemberButton} from ".";
import {CreateInvoiceButton} from "invoice/presentational";

const MemberPageSidebar = ({member, numInvoices}) => {
    const menuActions = [
        <EditButton />,
        <CreateInvoiceButton disabled={numInvoices} />,
        member.solo_mecha ? (
            <ConnectMemberButton member={member} />
        ) : (
            <DisconnectMemberButton member={member} />
        ),
        <DeleteMemberButton member={member} />,
    ];

    return <ActionsSidebarMenu menuActions={menuActions} showBackButton />;
};

export default MemberPageSidebar;
