import React from "react";
import {Spinner, ErrorMessage} from "components/common";
import {InvoiceDetail, InvoiceNavigator} from "components/invoice/presentation";
import ViewInvoiceSidebar from "./ViewInvoiceSidebar";
import EditInvoice from "./EditInvoice";
import {InvoiceService, MemberService} from "service/api";

class ViewInvoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id_factura: null,
            invoice: null,
            member: null,
            payments: null,
            view: "view",
            isLoading: null,
            errorMessage: null,
        };
        this.handleBack = this.handleBack.bind(this);
        this.handleClickEditInvoice = this.handleClickEditInvoice.bind(this);
        this.handleSubmitEditInvoice = this.handleSubmitEditInvoice.bind(this);
        this.handleBackEditInvoice = this.handleBackEditInvoice.bind(this);
        this.handleSuccessPrintInvoices = this.handleSuccessPrintInvoices.bind(this);
        this.handleSuccessCreateNewInvoiceVersion = this.handleSuccessCreateNewInvoiceVersion.bind(
            this
        );
    }

    static getDerivedStateFromProps(props, prevState) {
        const id_factura = props.id_factura || parseInt(props.match.params.id_factura);
        if (id_factura !== prevState.id_factura) {
            return {
                invoice: null,
                id_factura,
            };
        }
        return null;
    }

    componentDidMount() {
        this.loadInvoice();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.id_factura !== this.state.id_factura) {
            this.loadInvoice();
        }
    }

    loadInvoice() {
        this.setState({
            invoice: null,
            member: null,
            payments: null,
            isLoading: true,
            errorMessage: null,
        });
        InvoiceService.getInvoice(this.state.id_factura)
            .then(invoice => {
                this.setState({
                    invoice,
                    isLoading: false,
                });
                MemberService.getMember(invoice.num_socio).then(member => {
                    this.setState({member});
                });
                InvoiceService.getInvoicePayments(this.state.id_factura).then(
                    payments => {
                        this.setState({payments});
                    }
                );
            })
            .catch(error => {
                this.setState({
                    errorMessage:
                        "Se ha producido un error y no se han podido obtener los datos de la factura",
                    isLoading: false,
                });
            });
    }

    handleBack() {
        console.log("ViewInvoice.handleBack");
        if (this.props.handleBack) {
            this.props.handleBack();
        } else {
            this.props.history.push("/facturas");
        }
    }

    handleClickEditInvoice() {
        this.setState({view: "edit"});
    }

    handleBackEditInvoice() {
        this.setState({view: "view"});
        this.loadInvoice();
    }

    handleSubmitEditInvoice(invoice) {
        this.setState({view: "view", invoice});
    }

    handleSuccessPrintInvoices() {
        this.loadInvoice();
    }

    handleSuccessCreateNewInvoiceVersion(
        new_version_id_factura,
        old_version_id_factura
    ) {
        if (this.props.handleSuccessCreateNewInvoiceVersion) {
            this.props.handleSuccessCreateNewInvoiceVersion(
                new_version_id_factura,
                old_version_id_factura
            );
        } else {
            this.props.history.push("/facturas/" + new_version_id_factura);
        }
    }

    get view() {
        return (
            <div className="row no-gutters h-100">
                <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                    <ViewInvoiceSidebar
                        invoice={this.state.invoice}
                        handleClickEditInvoice={this.handleClickEditInvoice}
                        handleSuccessPrintInvoices={this.handleSuccessPrintInvoices}
                        handleSuccessCreateNewInvoiceVersion={
                            this.handleSuccessCreateNewInvoiceVersion
                        }
                        handleBack={this.handleBack}
                    />
                </nav>
                <div className="col-md-10 offset-md-2">
                    <div className="container">
                        {this.props.navigatorIds ? (
                            <InvoiceNavigator
                                selectedId={this.state.id_factura}
                                navigatorIds={this.props.navigatorIds}
                                handleClickSelect={
                                    this.props.handleClickSelectInNavigator
                                }
                            />
                        ) : null}
                        <ErrorMessage message={this.state.errorMessage} />
                        <InvoiceDetail
                            invoice={this.state.invoice}
                            member={this.state.member}
                            payments={this.state.payments}
                        />
                    </div>
                </div>
            </div>
        );
    }

    get edit() {
        return (
            <EditInvoice
                id_factura={this.state.id_factura}
                handleSubmit={this.handleSubmitEditInvoice}
                handleBack={this.handleBackEditInvoice}
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

export default ViewInvoice;
