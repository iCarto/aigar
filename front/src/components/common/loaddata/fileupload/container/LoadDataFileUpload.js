import React from "react";
import LoadDataFilesInput from "../presentation/LoadDataFilesInput";

class LoadDataFileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataFiles: [],
        };
    }

    getRemoveButton(filename) {
        return (
            <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={() => this.props.handleRemoveDataFile(filename)}
            >
                <span aria-hidden="true">&times;</span>
            </button>
        );
    }

    get dataFiles() {
        return this.props.dataFiles.map(dataFile => {
            if (dataFile.errors.length !== 0) {
                return (
                    <div className="alert alert-danger" key={dataFile.file.name}>
                        <strong>{dataFile.file.name}</strong>
                        {this.getRemoveButton(dataFile.file.name)}
                        <ul>
                            {dataFile.errors.map(error => {
                                return <li key={error.msg}>{error.msg}</li>;
                            })}
                        </ul>
                    </div>
                );
            }
            return (
                <div className="alert alert-success" key={dataFile.file.name}>
                    {dataFile.file.name}
                    {this.getRemoveButton(dataFile.file.name)}
                </div>
            );
        });
    }

    render() {
        return (
            <div className="form-group">
                <label htmlFor="fileUpload">Selecciona el fichero</label>
                <div name="fileUpload" className="form-control-file">
                    <LoadDataFilesInput
                        allowedFormats={this.props.allowedFormats}
                        handleLoadedDataFile={this.props.handleLoadedDataFile}
                    />
                    <small id="fileUploadHelp" className="form-text text-muted">
                        Extensiones permitidas ({this.props.allowedFormats.join(",")})
                    </small>
                    {this.dataFiles}
                </div>
            </div>
        );
    }
}

export default LoadDataFileUpload;
