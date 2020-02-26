import React from "react";
import {Spinner} from "components/common";
import {InvoiceForm} from "components/invoice/presentation";
import {createInvoice} from "model";
import {InvoiceService} from "service";
import {DataValidatorService} from "service/validation";

class EditInvoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoice: null,
            prevNumFactura: null,
            errors: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change
    // Esto nos permitiría navegar entre miembros con algún componente de más alto nivel y solo cambiando el número de socio
    static getDerivedStateFromProps(props, prevState) {
        // Store prevNumFactura in state so we can compare when props change.
        // Clear out previously-loaded data (so we don't render stale stuff).
        const num_factura = props.match.params.num_factura;
        if (num_factura !== prevState.prevNumFactura) {
            return {
                invoice: null,
                prevNumFactura: num_factura,
            };
        }
        return null;
    }

    componentDidMount() {
        this.loadInvoice(this.props.match.params.num_factura);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.invoice === null) {
            this.loadInvoice(this.props.match.params.num_factura);
        }
    }

    loadInvoice(num_factura) {
        if (num_factura) {
            InvoiceService.getInvoice(num_factura).then(invoice => {
                console.log("invoice", invoice);
                this.setState({invoice});
            });
        }
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
        console.log("EditInvoice.handleSubmit", this.state);
        this.props.history.push("/");
    }

    render() {
        if (this.state.invoice) {
            return (
                <InvoiceForm
                    invoice={this.state.invoice}
                    errors={this.state.errors}
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    cancelUrl={"/"}
                />
            );
        } else {
            return <Spinner message="Cargando datos" />;
        }
    }
}

export default EditInvoice;
