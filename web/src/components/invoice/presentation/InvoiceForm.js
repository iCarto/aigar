import React from "react";
import InvoicePrintButton from "components/common/invoicing/InvoicePrintButton";

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
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value =
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value;
        this.props.handleChange(name, value);
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

    getOutputFilename() {
        return "recibo_" + this.props.numero;
    }

    render() {
        // These fields are not stored in state because the component doesn't modify them.
        // They are always modified at the high order component and this component only render their values.
        const {
            numero,
            nombre,
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
            mora,
            total,
        } = this.getFormDataFromProps();
        return (
            <form
                onSubmit={this.handleSubmit}
                noValidate
                className="row needs-validation"
            >
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="numero">Número</label>
                        <input
                            type="text"
                            className="form-control"
                            name="numero"
                            value={numero.value}
                            aria-describedby="numero_help"
                            onChange={this.handleChange}
                            readOnly
                        />
                        <div className="invalid-feedback d-block">{numero.errors}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Caudal anterior</label>
                        <input
                            type="text"
                            className="form-control"
                            name="caudal_anterior"
                            value={caudal_anterior.value}
                            onChange={this.handleChange}
                            disabled
                        />
                        <div className="invalid-feedback d-block">
                            {caudal_anterior.errors}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Consumo</label>
                        <input
                            type="text"
                            className="form-control"
                            name="consumo"
                            value={consumo.value}
                            onChange={this.handleChange}
                        />
                        <div className="invalid-feedback d-block">{consumo.errors}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Caudal actual</label>
                        <input
                            type="text"
                            className="form-control"
                            name="caudal_actual"
                            value={caudal_actual.value}
                            onChange={this.handleChange}
                            disabled
                        />
                        <div className="invalid-feedback d-block">
                            {caudal_actual.errors}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Cuota fija</label>
                        <input
                            type="text"
                            className="form-control"
                            name="cuota_fija"
                            value={cuota_fija.value}
                            onChange={this.handleChange}
                        />
                        <div className="invalid-feedback d-block">
                            {cuota_fija.errors}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Cuota variable</label>
                        <input
                            type="text"
                            className="form-control"
                            name="cuota_variable"
                            value={cuota_variable.value}
                            onChange={this.handleChange}
                        />
                        <div className="invalid-feedback d-block">
                            {cuota_variable.errors}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="name">Comisión</label>
                        <input
                            type="text"
                            className="form-control"
                            name="comision"
                            value={comision.value}
                            onChange={this.handleChange}
                        />
                        <div className="invalid-feedback d-block">
                            {comision.errors}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Ahorro</label>
                        <input
                            type="text"
                            className="form-control"
                            name="ahorro"
                            value={ahorro.value}
                            onChange={this.handleChange}
                        />
                        <div className="invalid-feedback d-block">{ahorro.errors}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Asamblea</label>
                        <input
                            type="text"
                            className="form-control"
                            name="asamblea"
                            value={asamblea.value}
                            onChange={this.handleChange}
                        />
                        <div className="invalid-feedback d-block">
                            {asamblea.errors}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Derecho</label>
                        <input
                            type="text"
                            className="form-control"
                            name="derecho"
                            value={derecho.value}
                            onChange={this.handleChange}
                        />
                        <div className="invalid-feedback d-block">{derecho.errors}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Reconexión</label>
                        <input
                            type="text"
                            className="form-control"
                            name="reconexion"
                            value={reconexion.value}
                            onChange={this.handleChange}
                        />
                        <div className="invalid-feedback d-block">
                            {reconexion.errors}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Mora</label>
                        <input
                            type="text"
                            className="form-control"
                            name="mora"
                            value={mora.value}
                            onChange={this.handleChange}
                        />
                        <div className="invalid-feedback d-block">{mora.errors}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Total</label>
                        <input
                            type="text"
                            className="form-control"
                            name="total"
                            value={total.value}
                            onChange={this.handleChange}
                        />
                        <div className="invalid-feedback d-block">{total.errors}</div>
                    </div>
                </div>
                <div className="col-md-12 mt-4 d-flex justify-content-between">
                    <button
                        type="button"
                        className="btn"
                        onClick={this.props.handleBack}
                    >
                        Cancelar
                    </button>
                    <InvoicePrintButton
                        invoices={[this.props.invoice]}
                        buttonTitle="Impresión del recibo"
                        outputFilename={this.getOutputFilename()}
                    />
                    <button type="submit" className="btn btn-primary">
                        <i className="fas fa-print mr-2" />
                        Salvar
                    </button>
                </div>
            </form>
        );
    }
}

export default InvoiceForm;
