import React from "react";
import {Spinner} from "components/common";
import {LoadDataFile} from "model";

class LoadDataFileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            errors: [],
        };
        this.fileReader = null;
    }

    handleFileRead(evt, file) {
        let loadDataFile = new LoadDataFile({
            file,
            content: this.fileReader.result,
        });
        const errors = this.props.validator(loadDataFile);
        this.setState({errors});
        if (errors.length === 0) {
            this.props.handleFileRead(loadDataFile);
        }
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

    get messageError() {
        return this.state.errors.map(error => error.msg).join(<br />);
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
                        Extensiones permitidas ({this.props.allowedFormats.join(",")})
                    </small>
                    <div className="invalid-feedback d-block">{this.messageError}</div>
                </div>
            </div>
        );
    }
}

export default LoadDataFileUpload;
