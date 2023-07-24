import {useNavigate} from "react-router-dom";
import {BackButton, EditButton} from "base/common";
import DeleteMemberButton from "./DeleteMemberButton";
import DisconnectMemberButton from "./DisconnectMemberButton";
import ConnectMemberButton from "./ConnectMemberButton";

const ViewMemberSidebar = ({
    member,
    numInvoices,
    handleSuccessConnectMember,
    handleSuccessDisconnectMember,
    handleSuccessDeletedMember,
}) => {
    const navigate = useNavigate();

    const handleClickNewInvoice = () => {
        navigate("/socios/" + member.num_socio + "/nueva_factura");
    };

    return (
        <div className="sidebar-sticky d-flex flex-column">
            <div className="d-flex flex-column text-center">
                <div className="mt-1 mb-1">
                    <BackButton />
                </div>
            </div>
            {member && member.is_active ? (
                <div className="d-flex flex-column text-center pr-4 pl-4">
                    {numInvoices === 0 ? (
                        <button
                            onClick={handleClickNewInvoice}
                            className="btn btn-primary mt-1 mb-1"
                        >
                            <i className="fas fa-file-alt mr-2" />
                            Crear factura
                        </button>
                    ) : null}
                    <EditButton />
                    {member.solo_mecha ? (
                        <ConnectMemberButton
                            member={member}
                            handleSuccessConnectMember={handleSuccessConnectMember}
                        />
                    ) : (
                        <DisconnectMemberButton
                            member={member}
                            handleSuccessDisconnectMember={
                                handleSuccessDisconnectMember
                            }
                        />
                    )}
                    <DeleteMemberButton
                        member={member}
                        handleSuccessDeletedMember={handleSuccessDeletedMember}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default ViewMemberSidebar;
