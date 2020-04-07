import React from "react";
import {Spinner} from "components/common";
import {InvoiceForm} from "components/invoice/presentation";
import {createInvoice} from "model";
import {InvoiceService, MemberService} from "service/api";
import {DataValidatorService} from "service/validation";
import {MemberDetailShort} from "components/member/presentation";
import EditInvoiceSidebar from "./EditInvoiceSidebar";

class EditInvoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id_factura: null,
            invoice: null,
            member: null,
            errors: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    // https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change
    // Esto nos permitiría navegar entre miembros con algún componente de más alto nivel y solo cambiando el número de socio
    static getDerivedStateFromProps(props, prevState) {
        // Store prevNumFactura in state so we can compare when props change.
        // Clear out previously-loaded data (so we don't render stale stuff).
        const id_factura = props.id_factura || props.match.params.id_factura;
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
        InvoiceService.getInvoice(this.state.id_factura).then(invoice => {
            this.setState({invoice});
            MemberService.getMember(invoice.num_socio).then(member => {
                this.setState({member});
            });
        });
    }

    handleChange(name, value) {
        console.log("EditInvoice.handleChange", name, value);
        this.setState((prevState, props) => {
            const updatedInvoice = createInvoice(
                Object.assign({}, prevState.invoice, {[name]: value})
            );
            return {
                invoice: updatedInvoice,
                errors: DataValidatorService.validateInvoice(updatedInvoice),
            };
        });
    }

    handleSubmit() {
        console.log("EditMember.handleSubmit", this.state);
        InvoiceService.updateInvoice(this.state.invoice).then(updatedInvoice => {
            if (this.props.handleSubmit) {
                this.props.handleSubmit(updatedInvoice);
            } else {
                this.handleBack();
            }
        });
    }

    handleBack() {
        console.log("EditMember.handleBack");
        if (this.props.handleBack) {
            this.props.handleBack();
        } else {
            this.props.history.push("/facturas/");
        }
    }

    get sidebar() {
        return (
            <EditInvoiceSidebar
                handleBack={this.handleBack}
                invoice={this.state.invoice}
            />
        );
    }

    get content() {
        if (this.state.invoice) {
            return (
                <>
                    <MemberDetailShort member={this.state.member} />
                    <InvoiceForm
                        invoice={this.state.invoice}
                        errors={this.state.errors}
                        handleChange={this.handleChange}
                        handleSubmit={this.handleSubmit}
                    />
                </>
            );
        }
        return <Spinner message="Cargando datos" />;
    }

    render() {
        return (
            <div className="h-100">
                <div className="row h-100">
                    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                        {this.sidebar}
                    </nav>
                    <div className="col-md-10 offset-md-2">
                        <div className="container">{this.content}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditInvoice;
