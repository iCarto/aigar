import React from "react";
import {Spinner} from "components/common";
import {InvoiceDetail} from "components/invoice/presentation";
import ViewInvoiceSidebar from "./ViewInvoiceSidebar";
import EditInvoice from "./EditInvoice";
import {InvoiceService, MemberService} from "service/api";
import {MemberDetailShort} from "components/member/presentation";
import {PaymentsList} from "components/payments/presentation";

class ViewInvoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id_factura: null,
            invoice: null,
            member: null,
            payments: null,
            view: "view",
        };
        this.handleBack = this.handleBack.bind(this);
        this.handleClickEditInvoice = this.handleClickEditInvoice.bind(this);
        this.handleSubmitEditInvoice = this.handleSubmitEditInvoice.bind(this);
        this.handleBackEditInvoice = this.handleBackEditInvoice.bind(this);
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
        if (this.state.invoice === null) {
            this.loadInvoice();
        }
    }

    loadInvoice() {
        InvoiceService.getInvoice(this.state.id_factura).then(invoice => {
            this.setState({invoice});
            MemberService.getMember(invoice.num_socio).then(member => {
                this.setState({member});
            });
            InvoiceService.getInvoicePayments(this.state.id_factura).then(payments => {
                this.setState({payments});
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

    get view() {
        return (
            <div className="row h-100">
                <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                    <ViewInvoiceSidebar
                        invoice={this.state.invoice}
                        handleClickEditInvoice={this.handleClickEditInvoice}
                        handleBack={this.handleBack}
                    />
                </nav>
                <div className="col-md-10 offset-md-2">
                    <div className="container">
                        <MemberDetailShort member={this.state.member} />
                        <InvoiceDetail invoice={this.state.invoice} />
                        <PaymentsList payments={this.state.payments} />
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
        if (this.state.invoice) {
            return this[this.state.view];
        }
        return <Spinner message="Cargando datos" />;
    }

    render() {
        return <div className="h-100">{this.content}</div>;
    }
}

export default ViewInvoice;
