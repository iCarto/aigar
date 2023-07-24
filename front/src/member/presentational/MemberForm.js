import React from "react";
import {Spinner} from "base/common";
import {FormInput, FormSelectOrder} from "base/form";

/**
Controlled component for member form.

Props:
- @property member: object of type Member to update his data
- @property errors: list of errors related with member object
- @property handleChange: handle function called when a field changes his value
- @property handleSubmit: handle function called when submit button is pressed

The component responsability is to render object fields inside proper form fields
and show errors related with every field.

This component doesn't manage state because the state is stored in the container that includes it.
*/
class MemberForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dirty: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeOrder = this.handleChangeOrder.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeOrder(name, membersWithOrder) {
        this.props.handleChangeOrder(name, membersWithOrder);
        this.setState({dirty: true});
    }

    handleChange(name, value) {
        this.props.handleChange(name, value);
        this.setState({dirty: true});
    }

    handleChangeField(event) {
        const name = event.target.name;
        const value = event.target.value;
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
        Object.keys(this.props.member).forEach(memberField => {
            formData[memberField] = {};
            formData[memberField].value = this.props.member[memberField];
            formData[memberField].errors = this.getFieldErrorFromProps(memberField);
        });
        return formData;
    }

    render() {
        // These fields are not stored in state because the component doesn't modify them.
        // They are always modified at the high order component and this component only render their values.
        if (this.props.member) {
            const {
                num_socio,
                observaciones,
                name,
                sector,
                medidor,
                orden,
                consumo_maximo,
                consumo_reduccion_fija,
            } = this.getFormDataFromProps();
            return (
                <form
                    onSubmit={this.handleSubmit}
                    noValidate
                    className="needs-validation row"
                >
                    <div className="col-md-5 offset-md-2">
                        <FormInput
                            label="Número"
                            name="num_socio"
                            field={num_socio}
                            handleChange={this.handleChange}
                            readOnly={true}
                            small={true}
                            info={
                                num_socio.value === -1
                                    ? "El número de socio se calculará cuando pulse Salvar"
                                    : ""
                            }
                        />
                        <FormInput
                            label="Nombre"
                            name="name"
                            field={name}
                            handleChange={this.handleChange}
                        />
                        <div className="form-group">
                            <label htmlFor="sector">Sector</label>
                            <select
                                className="form-control"
                                name="sector"
                                onChange={this.handleChangeField}
                                value={sector.value}
                            >
                                <option></option>
                                {this.props.sectorsDomain.map(sector => (
                                    <option key={sector.key} value={sector.key}>
                                        {sector.value}
                                    </option>
                                ))}
                            </select>
                            <div className="invalid-feedback d-block">
                                {sector.errors}
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="observaciones">Observaciones</label>
                            <textarea
                                className="form-control"
                                name="observaciones"
                                value={observaciones.value}
                                onChange={this.handleChangeField}
                            ></textarea>
                            <div className="invalid-feedback d-block">
                                {observaciones.errors}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <FormInput
                            label="Medidor"
                            name="medidor"
                            field={medidor}
                            handleChange={this.handleChange}
                        />
                        <FormSelectOrder
                            label="Orden Ruta"
                            name="orden"
                            field={orden}
                            elements={this.props.membersWithOrder}
                            handleChange={this.handleChangeOrder}
                        />
                        <FormInput
                            label="Consumo máximo"
                            name="consumo_maximo"
                            field={consumo_maximo}
                            handleChange={this.handleChange}
                            small={true}
                        />
                        <FormInput
                            label="Consumo reducción fija"
                            name="consumo_reduccion_fija"
                            field={consumo_reduccion_fija}
                            handleChange={this.handleChange}
                            small={true}
                        />
                    </div>

                    <div className="col-md-12 mt-4 text-center">
                        {this.props.saving ? (
                            <Spinner />
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={
                                    !this.state.dirty || this.props.errors.length > 0
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

export default MemberForm;
