import React from "react";
import {FormInput, FormLabel} from "components/common/form";

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
        /*const name = event.target.name;
        const value =
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value;*/
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
        const {
            numero,
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
            mora,
            saldo_pendiente,
            total,
        } = this.getFormDataFromProps();
        return (
            <form
                onSubmit={this.handleSubmit}
                noValidate
                className="form-inline needs-validation d-flex flex-column align-items-center"
            >
                <div className="d-flex justify-content-center" style={{width: "100%"}}>
                    <FormLabel label="Número de factura" name="numero" field={numero} />
                </div>
                <div className="d-flex justify-content-between" style={{width: "100%"}}>
                    <FormInput
                        label="Caudal anterior"
                        name="caudal_anterior"
                        field={caudal_anterior}
                        handleChange={this.handleChange}
                    />
                    <FormInput
                        label="Consumo"
                        name="consumo"
                        field={consumo}
                        handleChange={this.handleChange}
                    />
                    <FormInput
                        label="Caudal actual"
                        name="caudal_actual"
                        field={caudal_actual}
                        handleChange={this.handleChange}
                    />
                </div>
                <div style={{width: "60%"}}>
                    <FormInput
                        label="Cuota fija"
                        name="cuota_fija"
                        field={cuota_fija}
                        handleChange={this.handleChange}
                    />
                    <FormInput
                        label="Cuota variable"
                        name="cuota_variable"
                        field={cuota_variable}
                        handleChange={this.handleChange}
                    />
                    <FormInput
                        label="Comisión de pago"
                        name="comision"
                        field={comision}
                        handleChange={this.handleChange}
                    />
                    <FormInput
                        label="Ahorro para mano de obra"
                        name="ahorro"
                        field={ahorro}
                        handleChange={this.handleChange}
                    />
                    <FormInput
                        label="Recargo por mora"
                        name="mora"
                        field={mora}
                        handleChange={this.handleChange}
                    />
                    <FormInput
                        label="Inasistencia a asambleas"
                        name="asamblea"
                        field={asamblea}
                        handleChange={this.handleChange}
                    />
                    <FormInput
                        label="Nuevo derecho"
                        name="derecho"
                        field={derecho}
                        handleChange={this.handleChange}
                    />
                    <FormInput
                        label="Re-conexión"
                        name="reconexion"
                        field={reconexion}
                        handleChange={this.handleChange}
                    />
                    <FormInput
                        label="Traspaso de derecho"
                        name="traspaso"
                        field={traspaso}
                        handleChange={this.handleChange}
                    />
                    <FormInput
                        label="Saldo pendiente"
                        name="saldo_pendiente"
                        field={saldo_pendiente}
                        handleChange={this.handleChange}
                    />
                    <FormInput
                        label="Total"
                        name="total"
                        field={total}
                        handleChange={this.handleChange}
                        readOnly={true}
                    />
                </div>
                <div className="col-md-12 mt-4 d-flex justify-content-center">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!this.state.dirty}
                    >
                        <i className="fas fa-save mr-2" />
                        Salvar
                    </button>
                </div>
            </form>
        );
    }
}

export default InvoiceForm;
