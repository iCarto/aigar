import {useNavigate} from "react-router-dom";
import {ActionsSidebarMenu} from "base/ui/menu";
import {EditButton} from "base/common";
import {ConnectMemberButton, DeleteMemberButton, DisconnectMemberButton} from ".";
import Button from "@mui/material/Button";

//TO-DO: Change name to MemberSidebar
const ViewMemberSidebar = ({member, numInvoices}) => {
    const navigate = useNavigate();

    const handleClickNewInvoice = () => {
        navigate("/socios/" + member.num_socio + "/nueva_factura");
    };

    const menuActions = [
        numInvoices === 0 ? (
            <Button onClick={handleClickNewInvoice}>Crear factura</Button>
        ) : null,
        <EditButton />,
        member.solo_mecha ? (
            <ConnectMemberButton member={member} />
        ) : (
            <DisconnectMemberButton member={member} />
        ),
        <DeleteMemberButton member={member} />,
    ];

    return <ActionsSidebarMenu menuActions={menuActions} showBackButton />;
};

export default ViewMemberSidebar;
