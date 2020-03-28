import React from "react";
import LoadDataFileUpload from "../common/loaddata/fileupload/LoadDataFileUpload";
import {CSVFile} from "model";
import {LoadDataValidatorService} from "service/validation";

class LoadPaymentsStep1ReadFile extends React.Component {
    state = {
        selectedProvider: "Banco",
        csvFile: null,

        fieldErrors: {
            selectedProvider: null,
            csvFile: null,
        },
    };

    constructor(props) {
        super(props);
        // TODO: What's the place of this configuration?
        this.providersList = ["Banco", "Tigo Money"];
        this.handlePaymentsFileRead = this.handlePaymentsFileRead.bind(this);
    }

    isCSVFileValid() {
        return (
            this.state.csvFile != null &&
            this.state.fieldErrors.csvFile != null &&
            this.state.fieldErrors.csvFile.length === 0
        );
    }

    /* HANDLERS FOR UI EVENTS */

    handleSelectedProviderChange(event) {
        let selectedProvider = event.target.value;
        this.setState({
            selectedProvider,
        });
    }

    handlePaymentsFileRead(file, content) {
        let csvFile = new CSVFile({
            file,
            content,
        });
        this.setState(
            {
                csvFile,
                fieldErrors: {
                    csvFile: LoadDataValidatorService.validatePaymentsFile(csvFile),
                },
            },
            () => {
                console.log("this.state.fieldErrors.length", this.state.fieldErrors);
                if (this.state.fieldErrors.csvFile.length === 0) {
                    this.props.afterValid(this.state.csvFile);
                }
            }
        );
    }

    /* VIEW SUBCOMPONENTS */

    get messages() {
        if (!this.state.csvFile) {
            return null;
        } else if (this.state.fieldErrors.csvFile.length === 0) {
            return (
                <div className="alert alert-success" role="alert">
                    El fichero es correcto
                </div>
            );
        } else {
            return (
                <div className="alert alert-danger" role="alert">
                    <ul>
                        {this.state.fieldErrors.csvFile.map(error => {
                            return <li key={error.msg}>{error.msg}</li>;
                        })}
                    </ul>
                </div>
            );
        }
    }

    get selectProvider() {
        let providersListOptions = this.providersList.map(provider => (
            <option key={provider}>{provider}</option>
        ));
        return (
            <div className="form-group">
                <label htmlFor="selectProvider">Selecciona el proveedor</label>
                <select
                    name="selectProvider"
                    className="form-control"
                    value={this.state.selectedProvider}
                    onChange={event => this.handleSelectedProviderChange(event)}
                >
                    {providersListOptions}
                </select>
            </div>
        );
    }

    get fileUpload() {
        return <LoadDataFileUpload handleFileRead={this.handlePaymentsFileRead} />;
    }

    get nextButton() {
        const disabled = !this.isCSVFileValid();
        return (
            <button
                className="btn btn-primary"
                type="button"
                onClick={this.props.next}
                disabled={disabled}
            >
                Verificar entradas del fichero <i className="fas fa-chevron-right"></i>
            </button>
        );
    }

    render() {
        return (
            <div className="col-12 row justify-content-center">
                <form className="col-md-8 card p-3 bg-light">
                    {this.selectProvider}
                    {this.fileUpload}
                    {this.messages}
                </form>
                <div className="col-md-12 text-center mt-4">{this.nextButton}</div>
            </div>
        );
    }
}

export default LoadPaymentsStep1ReadFile;
