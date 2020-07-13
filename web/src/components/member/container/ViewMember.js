import React from "react";
import {Spinner, ErrorMessage} from "components/common";
import {ListMemberInvoices} from "components/member/container";
import {MemberDetail} from "components/member/presentation";
import {MemberService, InvoiceService} from "service/api";
import ViewMemberSidebar from "./ViewMemberSidebar";
import EditMember from "./EditMember";

class ViewMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            member: null,
            num_socio: null,
            view: "view",
            isLoading: null,
            errorMessage: null,
        };
        this.handleBack = this.handleBack.bind(this);
        this.handleClickEditMember = this.handleClickEditMember.bind(this);
        this.handleSubmitEditMember = this.handleSubmitEditMember.bind(this);
        this.handleBackEditMember = this.handleBackEditMember.bind(this);
        this.handleSuccessDeletedMember = this.handleSuccessDeletedMember.bind(this);
        this.handleSuccessConnectMember = this.handleSuccessConnectMember.bind(this);
        this.handleSuccessDisconnectMember = this.handleSuccessDisconnectMember.bind(
            this
        );
        this.handleClickNewInvoice = this.handleClickNewInvoice.bind(this);
    }

    static getDerivedStateFromProps(props, prevState) {
        const num_socio = props.num_socio || parseInt(props.match.params.num_socio);
        if (num_socio !== prevState.num_socio) {
            return {
                member: null,
                invoices: null,
                num_socio,
            };
        }
        return null;
    }

    componentDidMount() {
        this.loadMember();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.num_socio !== this.state.num_socio) {
            this.loadMember();
        }
    }

    loadMember() {
        Promise.all([
            MemberService.getMember(this.state.num_socio),
            InvoiceService.getInvoicesForMember(this.state.num_socio),
        ])
            .then(result => {
                const member = result[0];
                this.setState({
                    member,
                    invoices: result[1],
                    isLoading: false,
                    errorMessage: member.is_active ? null : "El socio ha sido borrado.",
                });
            })
            .catch(error => {
                this.setState({
                    errorMessage:
                        "Se ha producido un error y no se han podido obtener los datos del socio",
                    isLoading: false,
                });
            });
    }

    handleBack() {
        console.log("ViewMember.handleBack");
        if (this.props.handleBack) {
            this.props.handleBack();
        } else {
            this.props.history.push("/socios");
        }
    }

    handleClickEditMember() {
        this.setState({view: "edit"});
    }

    handleBackEditMember() {
        this.setState({view: "view"});
        this.loadMember();
    }

    handleSubmitEditMember(member) {
        this.setState({view: "view", member});
        this.loadMember();
    }

    handleSuccessConnectMember() {
        this.setState({view: "view"});
        this.loadMember();
    }

    handleSuccessDisconnectMember() {
        this.setState({view: "view"});
        this.loadMember();
    }

    handleSuccessDeletedMember() {
        this.handleBack();
    }

    handleClickNewInvoice() {
        this.props.history.push("/socios/" + this.state.num_socio + "/nueva_factura");
    }

    get view() {
        return (
            <div className="row no-gutters h-100">
                <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                    <ViewMemberSidebar
                        member={this.state.member}
                        numInvoices={
                            this.state.invoices ? this.state.invoices.length : 0
                        }
                        handleClickEditMember={this.handleClickEditMember}
                        handleSuccessDeletedMember={this.handleSuccessDeletedMember}
                        handleSuccessConnectMember={this.handleSuccessConnectMember}
                        handleSuccessDisconnectMember={
                            this.handleSuccessDisconnectMember
                        }
                        handleClickNewInvoice={this.handleClickNewInvoice}
                        handleBack={this.handleBack}
                    />
                </nav>
                <div className="col-md-10 offset-md-2">
                    <div className="container">
                        <ErrorMessage message={this.state.errorMessage} />
                        <MemberDetail member={this.state.member} />
                        {this.state.member ? (
                            <ListMemberInvoices invoices={this.state.invoices} />
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }

    get edit() {
        return (
            <EditMember
                num_socio={this.state.num_socio}
                handleSubmit={this.handleSubmitEditMember}
                handleBack={this.handleBackEditMember}
            />
        );
    }

    get content() {
        if (this.state.isLoading) {
            return <Spinner message="Cargando datos" />;
        }
        return this[this.state.view];
    }

    render() {
        return <div className="h-100">{this.content}</div>;
    }
}

export default ViewMember;
