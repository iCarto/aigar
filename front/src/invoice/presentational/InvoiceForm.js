import React from "react";
import {FormInput} from "base/form";
import {Spinner} from "base/common";
import {MemberDetailShort} from "member/presentational";
import InvoiceDetailShort from "./InvoiceDetailShort";
import {ESTADOS_FACTURA} from "invoice/model";

/**
Controlled component for invoice form.

Props:
- @property invoice: object of type Invoice to update his data
- @property errors: list of errors related with invoice object
- @property handleChange: handle function called when a field changes his value
- @property handleSubmit: handle function called when submit button is pressed

The component responsability is to render object fields inside proper form fields
and show errors related with every field.

This component doesn't manage state because the state is stored in the container that includes it.
*/
class InvoiceForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dirty: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(name, value) {
        this.props.handleChange(name, value);
        this.setState({dirty: true});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.handleSubmit();
    }

    getFieldErrorFromProps(field) {
        const fieldErrors = this.props.errors
            ? this.props.errors.filter(error => error.field === field)
            : [];
        return fieldErrors.map(error => error.msg).join(<br />);
    }

    getFormDataFromProps() {
        let formData = {};
        Object.keys(this.props.invoice).forEach(invoiceField => {
            formData[invoiceField] = {};
            formData[invoiceField].value = this.props.invoice[invoiceField];
            formData[invoiceField].errors = this.getFieldErrorFromProps(invoiceField);
        });
        return formData;
    }

    render() {
        // These fields are not stored in state because the component doesn't modify them.
        // They are always modified at the high order component and this component only render their values.
        if (this.props.invoice) {
            const {
                id_factura,
                consumo,
                caudal_actual,
                caudal_anterior,
                cuota_fija,
                cuota_variable,
                comision,
                ahorro,
                asamblea,
                derecho,
                reconexion,
                traspaso,
                otros,
                mora,
                saldo_pendiente,
                descuento,
                total,
            } = this.getFormDataFromProps();
            const isReadOnlyInvoice =
                this.props.invoice.estado !== ESTADOS_FACTURA.NUEVA;
            const isNewInvoice = id_factura.value == -1;
            return (
                <form
                    onSubmit={this.handleSubmit}
                    noValidate
                    className="row p-2 mb-3 form-inline needs-validation"
                >
                    <div className="row col-md-12">
                        <div className="col-md-8">
                            <MemberDetailShort member={this.props.member} />
                        </div>
                        <div className="col-md-4">
                            <InvoiceDetailShort invoice={this.props.invoice} />
                        </div>
                    </div>
                    <div className="row col-md-12 p-3">
                        <div className="col-md-4 text-nowrap">
                            <FormInput
                                label="Caudal anterior"
                                name="caudal_anterior"
                                field={caudal_anterior}
                                handleChange={this.handleChange}
                                readOnly={!isNewInvoice}
                                small={true}
                            />
                        </div>
                        <div className="col-md-4 d-inline-block">
                            <FormInput
                                label="Caudal actual"
                                name="caudal_actual"
                                field={caudal_actual}
                                handleChange={this.handleChange}
                                readOnly={isReadOnlyInvoice}
                                small={true}
                            />
                        </div>
                        <div className="col-md-4 text-nowrap">
                            <FormInput
                                label="Consumo"
                                name="consumo"
                                field={consumo}
                                handleChange={this.handleChange}
                                readOnly={true}
                                small={true}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            <FormInput
                                label="Cuota fija"
                                name="cuota_fija"
                                field={cuota_fija}
                                handleChange={this.handleChange}
                                small={true}
                            />
                        </div>
                        <div className="col-md-6 offset-md-3">
                            <FormInput
                                label="Cuota variable"
                                name="cuota_variable"
                                field={cuota_variable}
                                handleChange={this.handleChange}
                                readOnly={!isNewInvoice}
                                small={true}
                            />
                        </div>
                        <div className="col-md-6 offset-md-3">
                            <FormInput
                                label="Comisión de pago"
                                name="comision"
                                field={comision}
                                handleChange={this.handleChange}
                                readOnly={!isNewInvoice}
                                small={true}
                            />
                        </div>
                        <div className="col-md-6 offset-md-3">
                            <FormInput
                                label="Ahorro para mano de obra"
                                name="ahorro"
                                field={ahorro}
                                handleChange={this.handleChange}
                                readOnly={!isNewInvoice}
                                small={true}
                            />
                        </div>
                        <div className="col-md-6 offset-md-3">
                            <FormInput
                                label="Recargo por mora"
                                name="mora"
                                field={mora}
                                handleChange={this.handleChange}
                                readOnly={isReadOnlyInvoice}
                                small={true}
                            />
                        </div>
                        <div className="col-md-6 offset-md-3">
                            <FormInput
                                label="Inasistencia a asambleas"
                                name="asamblea"
                                field={asamblea}
                                handleChange={this.handleChange}
                                readOnly={isReadOnlyInvoice}
                                small={true}
                            />
                        </div>
                        <div className="col-md-6 offset-md-3">
                            <FormInput
                                label="Nuevo derecho"
                                name="derecho"
                                field={derecho}
                                handleChange={this.handleChange}
                                readOnly={isReadOnlyInvoice}
                                small={true}
                            />
                        </div>
                        <div className="col-md-6 offset-md-3">
                            <FormInput
                                label="Re-conexión"
                                name="reconexion"
                                field={reconexion}
                                handleChange={this.handleChange}
                                readOnly={isReadOnlyInvoice}
                                small={true}
                            />
                        </div>
                        <div className="col-md-6 offset-md-3">
                            <FormInput
                                label="Traspaso de derecho"
                                name="traspaso"
                                field={traspaso}
                                handleChange={this.handleChange}
                                readOnly={isReadOnlyInvoice}
                                small={true}
                            />
                        </div>
                        <div className="col-md-6 offset-md-3">
                            <FormInput
                                label="Otros"
                                name="otros"
                                field={otros}
                                handleChange={this.handleChange}
                                readOnly={isReadOnlyInvoice}
                                small={true}
                            />
                        </div>
                        <div className="col-md-6 offset-md-3">
                            <FormInput
                                label="Saldo pendiente"
                                name="saldo_pendiente"
                                field={saldo_pendiente}
                                handleChange={this.handleChange}
                                readOnly={!isNewInvoice}
                                small={true}
                            />
                        </div>
                        <div className="col-md-6 offset-md-3">
                            <FormInput
                                label="Descuento"
                                name="descuento"
                                field={descuento}
                                handleChange={this.handleChange}
                                readOnly={isReadOnlyInvoice}
                                small={true}
                            />
                        </div>
                        <div className="col-md-6 offset-md-3">
                            <FormInput
                                label="Total"
                                name="total"
                                field={total}
                                handleChange={this.handleChange}
                                readOnly={true}
                                small={true}
                            />
                        </div>
                    </div>
                    <div className="col-md-12 mt-4 d-flex justify-content-center">
                        {this.props.saving ? (
                            <Spinner />
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={
                                    !this.state.dirty ||
                                    this.props.errors.length > 0 ||
                                    isReadOnlyInvoice
                                }
                            >
                                <i className="fas fa-save mr-2" />
                                Salvar
                            </button>
                        )}
                    </div>
                </form>
            );
        }
        return null;
    }
}

export default InvoiceForm;
