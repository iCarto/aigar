import React from "react";
import {Spinner, ErrorMessage} from "components/common";
import {InvoiceForm} from "components/invoice/presentation";
import {createInvoice, refreshInvoiceValues} from "model";
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
            validationErrors: null,
            isLoading: null,
            isSaving: null,
            errorMessage: null,
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
        this.setState({
            invoice: null,
            isLoading: true,
            errorMessage: null,
        });
        InvoiceService.getInvoice(this.state.id_factura)
            .then(invoice => {
                this.setState({
                    invoice,
                    isLoading: false,
                    errorMessage: invoice.is_active
                        ? null
                        : "La factura ha sido borrada.",
                });
                MemberService.getMember(invoice.num_socio).then(member => {
                    this.setState({member});
                });
            })
            .catch(error => {
                this.setState({
                    errorMessage:
                        "Se ha producido un error y no se han podido obtener los datos de la factura",
                    isLoading: false,
                });
            });
    }

    handleChange(name, value) {
        console.log("EditInvoice.handleChange", name, value);
        this.setState((prevState, props) => {
            const invoiceDataWithNewChange = Object.assign({}, prevState.invoice, {
                [name]: value,
            });
            const validationErrors = DataValidatorService.validateInvoice(
                invoiceDataWithNewChange
            );
            let updatedInvoice = createInvoice(invoiceDataWithNewChange);
            if (validationErrors.length === 0) {
                updatedInvoice = refreshInvoiceValues(
                    updatedInvoice,
                    this.state.member.consumo_maximo,
                    this.state.member.consumo_reduccion_fija
                );
            }
            console.log({updatedInvoice});
            return {
                invoice: updatedInvoice,
                validationErrors,
            };
        });
    }

    handleSubmit() {
        console.log("EditMember.handleSubmit", this.state);
        this.setState({
            isSaving: true,
            errorMessage: null,
        });
        InvoiceService.updateInvoice(this.state.invoice)
            .then(updatedInvoice => {
                this.setState({
                    isSaving: false,
                });
                if (this.props.handleSubmit) {
                    this.props.handleSubmit(updatedInvoice);
                } else {
                    this.handleBack();
                }
            })
            .catch(error => {
                this.setState({
                    errorMessage:
                        "Se ha producido un error y no se han podido almacenar los datos de la factura",
                    isSaving: false,
                });
            });
    }

    handleBack() {
        console.log("EditMember.handleBack");
        if (this.props.handleBack) {
            this.props.handleBack();
        } else {
            this.props.history.push("/facturas/" + this.state.id_factura);
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
        if (this.state.isLoading) {
            return <Spinner message="Cargando datos" />;
        }
        return (
            <>
                <ErrorMessage message={this.state.errorMessage} />
                <MemberDetailShort member={this.state.member} />
                <InvoiceForm
                    invoice={this.state.invoice}
                    errors={this.state.validationErrors}
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    saving={this.state.isSaving}
                />
            </>
        );
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
