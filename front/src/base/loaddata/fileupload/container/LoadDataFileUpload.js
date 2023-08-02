import LoadDataFilesInput from "../presentation/LoadDataFilesInput";

const LoadDataFileUpload = ({
    allowedFormats,
    handleLoadedDataFile,
    dataFiles,
    handleRemoveDataFile,
}) => {
    const RemoveButton = ({filename}) => {
        return (
            <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={() => handleRemoveDataFile(filename)}
            >
                <span aria-hidden="true">&times;</span>
            </button>
        );
    };

    const renderDataFiles = () => {
        return dataFiles.map(dataFile => {
            if (dataFile.errors.length !== 0) {
                return (
                    <div className="alert alert-danger" key={dataFile.file.name}>
                        <strong>{dataFile.file.name}</strong>
                        <RemoveButton filename={dataFile.file.name} />
                        <ul>
                            {dataFile.errors.map(error => (
                                <li key={error.msg}>{error.msg}</li>
                            ))}
                        </ul>
                    </div>
                );
            }
            return (
                <div className="alert alert-success" key={dataFile.file.name}>
                    {dataFile.file.name}
                    <RemoveButton filename={dataFile.file.name} />
                </div>
            );
        });
    };

    return (
        <div className="form-group">
            <label htmlFor="fileUpload">Seleccione el fichero</label>
            <div name="fileUpload" className="form-control-file">
                <LoadDataFilesInput
                    allowedFormats={allowedFormats}
                    handleLoadedDataFile={handleLoadedDataFile}
                />
                <small id="fileUploadHelp" className="form-text text-muted">
                    Extensiones permitidas ({allowedFormats.join(",")})
                </small>
                {renderDataFiles()}
            </div>
        </div>
    );
};

export default LoadDataFileUpload;
