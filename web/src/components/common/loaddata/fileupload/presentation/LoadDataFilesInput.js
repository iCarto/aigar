import React from "react";
import {Spinner} from "components/common";
import {LoadDataFile} from "model";

class LoadDataFilesInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileReaders: [],
        };
    }

    async handleFileRead(evt, file) {
        this.setState(prevState => {
            let fileReaders = prevState.fileReaders;
            const fileReaderIndex = fileReaders.findIndex(
                fileReaderWithFilename => fileReaderWithFilename.filename === file.name
            );
            const fileReaderInfo = prevState.fileReaders[fileReaderIndex];
            let loadDataFile = new LoadDataFile({
                file,
                content: fileReaderInfo.reader.result,
            });
            this.props.handleLoadedDataFile(loadDataFile);
            fileReaders.splice(fileReaderIndex, 1);
            return fileReaders;
        });
    }

    handleFileChosen(filesToRead) {
        for (let i = 0; i < filesToRead.length; i++) {
            let fileReader = new FileReader();
            fileReader.onloadend = (file => {
                return function(evt) {
                    this.handleFileRead(evt, file);
                };
            })(filesToRead[i]).bind(this);
            this.setState(prevState => {
                let fileReaders = prevState.fileReaders;
                fileReaders.push({
                    filename: filesToRead[i].name,
                    reader: fileReader,
                });
                fileReader.readAsText(filesToRead[i]);
                return fileReaders;
            });
        }
    }

    get fileReaders() {
        return this.state.fileReaders.map(fileReader => {
            return (
                <div key={fileReader.filename}>
                    <Spinner message={"Leyendo archivo... " + fileReader.filename} />
                </div>
            );
        });
    }

    render() {
        return (
            <div className="d-flex flex-column align-items-start">
                <input
                    type="file"
                    id="file"
                    className="input-file"
                    accept={this.props.allowedFormats.join(",")}
                    onChange={e => this.handleFileChosen(e.target.files)}
                    aria-describedby="fileUploadHelp"
                    multiple
                />
                {this.fileReaders}
                {this.state.loading ? <Spinner message="Subiendo archivo" /> : null}
            </div>
        );
    }
}

export default LoadDataFilesInput;
