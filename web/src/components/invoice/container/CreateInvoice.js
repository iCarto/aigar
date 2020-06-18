import React from "react";
import {InvoiceForm} from "components/invoice/presentation";
import {createInvoice, createInvoiceForMember, refreshInvoiceValues} from "model";
import {DataValidatorService} from "service/validation";
import {InvoiceService, MemberService, InvoicingMonthService} from "service/api";
import CreateInvoiceSidebar from "./CreateInvoiceSidebar";
import {ErrorMessage} from "components/common";

class CreateInvoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoice: createInvoice(),
            member: null,
            validationErrors: [],
            isSaving: null,
            errorMessage: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    static getDerivedStateFromProps(props, prevState) {
        const num_socio = props.num_socio || props.match.params.num_socio;
        if (num_socio !== prevState.num_socio) {
            return {
                member: null,
                num_socio,
                invoice: createInvoice(),
            };
        }
        return null;
    }

    componentDidMount() {
        this.loadDataForInvoice();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.num_socio !== this.state.num_socio) {
            this.loadDataForInvoice();
        }
    }

    loadDataForInvoice() {
        this.setState({
            member: null,
            isLoading: true,
            errorMessage: null,
        });
        Promise.all([
            MemberService.getMember(this.state.num_socio),
            InvoicingMonthService.getInvoicingMonths(),
            InvoiceService.getInvoicesForMember(this.state.num_socio),
        ])
            .then(result => {
                const member = result[0];
                const invoicingMonthOpened = result[1].find(
                    invoicingMonth => invoicingMonth.is_open
                );
                const invoicesForMember = result[2].filter(
                    invoice =>
                        invoice.mes_facturacion ===
                        invoicingMonthOpened.id_mes_facturacion
                );
                this.setState({
                    member,
                    isLoading: false,
                    invoice: createInvoiceForMember(
                        member,
                        invoicingMonthOpened,
                        invoicesForMember.length + 1
                    ),
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
        console.log("CreateInvoice.handleChange", {name}, {value});
        this.setState((prevState, props) => {
            const invoiceDataWithNewChange = Object.assign({}, prevState.invoice, {
                [name]: value,
            });
            let updatedInvoice = createInvoice(invoiceDataWithNewChange);
            updatedInvoice = refreshInvoiceValues(
                updatedInvoice,
                this.state.member.consumo_maximo,
                this.state.member.consumo_reduccion_fija
            );
            console.log({updatedInvoice});
            return {
                invoice: updatedInvoice,
                validationErrors: DataValidatorService.validateInvoice(updatedInvoice),
            };
        });
    }

    handleSubmit() {
        this.setState({
            isSaving: true,
            errorMessage: null,
        });
        InvoiceService.createInvoice(this.state.invoice)
            .then(createdInvoice => {
                this.setState({
                    isSaving: false,
                });
                if (this.props.handleSubmit) {
                    this.props.handleSubmit(createdInvoice.id_factura);
                } else {
                    this.handleBack(createdInvoice.id_factura);
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    errorMessage:
                        "Se ha producido un error y no se han podido almacenar los datos de la factura",
                    isSaving: false,
                });
            });
    }

    handleBack(id_factura) {
        console.log("CreateInvoice.handleBack");
        if (this.props.handleBack) {
            this.props.handleBack(id_factura);
        } else if (id_factura) {
            this.props.history.push("/facturas/" + id_factura);
        } else {
            this.props.history.push("/facturas");
        }
    }

    get sidebar() {
        return <CreateInvoiceSidebar handleBack={this.handleBack} />;
    }

    get content() {
        return (
            <>
                <ErrorMessage message={this.state.errorMessage} />
                <InvoiceForm
                    invoice={this.state.invoice}
                    member={this.state.member}
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
                <div className="row no-gutters h-100">
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

export default CreateInvoice;
