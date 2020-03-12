import React from "react";

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
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value =
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value;
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
        const {
            num_socio,
            observaciones,
            name,
            sector,
            medidor,
            solo_mecha,
            orden,
            consumo_maximo,
            consumo_reduccion_fija,
            comunidad,
        } = this.getFormDataFromProps();
        return (
            <form
                onSubmit={this.handleSubmit}
                noValidate
                className="needs-validation row"
            >
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="num_socio">Número</label>
                        <input
                            type="text"
                            className="form-control"
                            name="num_socio"
                            value={num_socio.value}
                            aria-describedby="num_socio_help"
                            onChange={this.handleChange}
                            readOnly
                        />
                        <small
                            id="num_socio_help"
                            className={`form-text text-muted ${
                                num_socio === -1 ? "d-none" : ""
                            }`}
                        >
                            El número de socio se calculará cuando pulse salvar
                        </small>
                        <div className="invalid-feedback d-block">
                            {num_socio.errors}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={name.value}
                            onChange={this.handleChange}
                        />
                        <div className="invalid-feedback d-block">{name.errors}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="sector">Sector</label>
                        <select
                            className="form-control"
                            name="sector"
                            onChange={this.handleChange}
                            value={sector.value}
                        >
                            <option></option>
                            {[1, 2, 3, 4, 5].map(n => (
                                <option key={n}>{n}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback d-block">{sector.errors}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="comunidad">Comunidad</label>
                        <input
                            type="text"
                            className="form-control"
                            name="comunidad"
                            value={comunidad.value}
                            readOnly
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="medidor">Medidor</label>
                        <input
                            type="text"
                            className="form-control"
                            name="medidor"
                            value={medidor.value}
                            onChange={this.handleChange}
                        />
                        <div className="invalid-feedback d-block">{medidor.errors}</div>
                    </div>
                    <div className="form-group form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            name="solo_mecha"
                            value={solo_mecha.value}
                            onChange={this.handleChange}
                        />
                        <label className="form-check-label" htmlFor="solo_mecha">
                            Sólo Mecha
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="orden">Orden Ruta</label>
                        <input
                            type="number"
                            className="form-control"
                            name="orden"
                            value={orden.value}
                            onChange={this.handleChange}
                        />
                        <div className="invalid-feedback d-block">{orden.errors}</div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="observaciones">Observaciones</label>
                        <textarea
                            className="form-control"
                            name="observaciones"
                            value={observaciones.value}
                            onChange={this.handleChange}
                        ></textarea>
                        <div className="invalid-feedback d-block">
                            {observaciones.errors}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="consumo_maximo">Consumo máximo</label>
                        <input
                            type="number"
                            className="form-control"
                            name="consumo_maximo"
                            value={consumo_maximo.value}
                            onChange={this.handleChange}
                        />
                        <div className="invalid-feedback d-block">
                            {consumo_maximo.errors}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="consumo_reduccion_fija">
                            Consumo reducción fija
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            name="consumo_reduccion_fija"
                            value={consumo_reduccion_fija.value}
                            onChange={this.handleChange}
                        />
                        <div className="invalid-feedback d-block">
                            {consumo_reduccion_fija.errors}
                        </div>
                    </div>
                </div>

                <div className="col-md-12 mt-4 text-center">
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

export default MemberForm;
