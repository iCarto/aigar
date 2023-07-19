import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Spinner, ErrorMessage} from "components/common";
import {ListMemberInvoices} from "components/member/container";
import {MemberDetail} from "components/member/presentation";
import {MemberService, InvoiceService} from "service/api";
import ViewMemberSidebar from "./ViewMemberSidebar";
import EditMember from "./EditMember";

const ViewMember = () => {
    const [member, setMember] = useState(null);
    const [invoices, setInvoices] = useState(null);
    const [view, setView] = useState("view");
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState("");

    const {num_socio} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);

        Promise.all([
            MemberService.getMember(num_socio),
            InvoiceService.getInvoicesForMember(num_socio),
        ])
            .then(result => {
                const member = result[0];
                setMember(member);
                setInvoices(result[1]);
                if (!member.is_active) setError("El socio ha sido borrado.");
            })
            .catch(error => {
                console.log(error);
                setError(
                    "Se ha producido un error y no se han podido obtener los datos del socio"
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [num_socio]);

    const handleBack = () => {
        console.log("ViewInvoice.handleBack");
        navigate(-1);
    };

    const handleClickEdit = () => {
        setView("edit");
    };

    const handleBackEdit = () => {
        setView("view");
    };

    const handleSubmitEdit = updatedItem => {
        setView("view");
        setMember(updatedItem);
    };

    const handleSuccessConnectMember = () => {
        setView("view");
    };

    const handleSuccessDisconnectMember = () => {
        setView("view");
    };

    const handleSuccessDeletedMember = () => {
        handleBack();
    };

    const handleClickNewInvoice = () => {
        navigate("/socios/" + num_socio + "/nueva_factura");
    };

    const viewContent = (
        <div className="row no-gutters h-100">
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                {member ? (
                    <ViewMemberSidebar
                        member={member}
                        numInvoices={invoices ? invoices.length : 0}
                        handleClickEditMember={handleClickEdit}
                        handleSuccessDeletedMember={handleSuccessDeletedMember}
                        handleSuccessConnectMember={handleSuccessConnectMember}
                        handleSuccessDisconnectMember={handleSuccessDisconnectMember}
                        handleClickNewInvoice={handleClickNewInvoice}
                        handleBack={handleBack}
                    />
                ) : null}
            </nav>
            <div className="col-md-10 offset-md-2">
                <div className="container">
                    <ErrorMessage message={error} />
                    {member ? <MemberDetail member={member} /> : null}
                    {invoices ? <ListMemberInvoices invoices={invoices} /> : null}
                </div>
            </div>
        </div>
    );

    const editContent = (
        <EditMember
            entity={member}
            onSubmit={handleSubmitEdit}
            // handleBack={handleBackEdit}
        />
    );

    const content = isLoading ? (
        <Spinner message="Cargando datos" />
    ) : view === "view" ? (
        viewContent
    ) : (
        editContent
    );

    return <div className="h-100">{content}</div>;
};

export default ViewMember;
