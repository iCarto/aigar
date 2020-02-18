import React from "react";
import ImportedDataTable from "../common/importeddata/table/ImportedDataTable";
import ImportedDataValidatorService from "../../service/validation/ImportedDataValidatorService";

class LoadPaymentsStep2PaymentsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payments: this.props.payments,
            paymentsErrors: this.validatePayments(this.props.payments),
        };
        console.log(this.state);
    }

    validatePayments(payments) {
        return payments
            .map(payment => ImportedDataValidatorService.validatePaymentEntry(payment))
            .flat();
    }

    filterPayment(payment, filterText) {
        return payment.invoice.indexOf(filterText) >= 0;
    }

    isValid() {
        return (
            this.state.payments != null &&
            this.state.paymentsErrors != null &&
            this.state.paymentsErrors.length === 0
        );
    }

    /* VIEW SUBCOMPONENTS */

    get messages() {
        if (this.state.paymentsErrors.length !== 0) {
            return (
                <div className="alert alert-danger" role="alert">
                    Se han encontrado errores en&nbsp;
                    <strong>{this.state.paymentsErrors.length}</strong> registros.
                </div>
            );
        }
        return (
            <div className="alert alert-success" role="alert">
                No se han encontrado errores.
            </div>
        );
    }

    get previousButton() {
        return (
            <button
                className="btn btn-secondary"
                type="button"
                onClick={this.props.prev}
            >
                <i className="fas fa-chevron-left"></i> Cargar nuevo fichero
            </button>
        );
    }

    get nextButton() {
        return (
            <button
                className="btn btn-primary float-right"
                type="button"
                onClick={this.props.next}
                disabled={!this.isValid()}
            >
                Actualizar facturas <i className="fas fa-chevron-right"></i>
            </button>
        );
    }

    render() {
        const headers = ["Factura", "Fecha", "Importe"];
        const fields = ["invoice", "date", "amount"];
        return (
            <div className="column">
                <div className="col-12">
                    <ImportedDataTable
                        headers={headers}
                        fields={fields}
                        elements={this.state.payments}
                        errors={this.state.paymentsErrors}
                        filterByText={this.filterPayment}
                    />
                </div>
                <div className="col-12">
                    {this.previousButton}
                    {this.nextButton}
                </div>
            </div>
        );
    }
}

export default LoadPaymentsStep2PaymentsTable;
