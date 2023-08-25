import {ActionsSidebarMenu} from "base/ui/menu/components";
import {EditButton} from "base/common";
import {ConnectMemberButton, DeleteMemberButton, DisconnectMemberButton} from ".";
import {CreateInvoiceButton} from "invoice/presentational";

const MemberPageSidebar = ({member, numInvoices}) => {
    const menuActions = [
        <EditButton />,
        <CreateInvoiceButton disabled={!!numInvoices} />,
        // !member.is_active ? (
        //     <ConnectMemberButton member={member} />
        // ) : (
        //     <DisconnectMemberButton member={member} />
        // ),
        <DeleteMemberButton member={member} />,
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
