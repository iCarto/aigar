import React from "react";
import {Spinner} from "components/common";

class ImportedDataFileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
        this.fileReader = null;
    }

    handleFileRead(evt, file) {
        this.props.handleFileRead(file, this.fileReader.result);
    }

    handleFileChosen(fileToRead) {
        this.setState({loading: true});
        this.fileReader = new FileReader();
        this.fileReader.onloadend = (file => {
            return function(evt) {
                this.handleFileRead(evt, file);
                this.setState({loading: false});
            };
        })(fileToRead).bind(this);
        this.fileReader.readAsText(fileToRead);
    }

    render() {
        return (
            <div className="form-group">
                <label htmlFor="fileUpload">Selecciona el fichero</label>
                <div name="fileUpload" className="form-control-file">
                    <input
                        type="file"
                        id="file"
                        className="input-file"
                        accept={this.props.allowedFormats.join(",")}
                        onChange={e => this.handleFileChosen(e.target.files[0])}
                        aria-describedby="fileUploadHelp"
                    />
                    {this.state.loading ? <Spinner message="Subiendo archivo" /> : null}
                    <small id="fileUploadHelp" className="form-text text-muted">
                        La extensión del fichero debe ser{" "}
                        {this.props.allowedFormats.join(",")}
                    </small>
                </div>
            </div>
        );
    }
}

export default ImportedDataFileUpload;
