import {LoadDataFilesInput} from ".";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const LoadDataFileUploadArea = ({
    dataFiles,
    allowedFormats,
    handleLoadedDataFile,
    handleRemoveDataFile,
}) => {
    const renderDataFiles = () => {
        return dataFiles.map(dataFile => {
            if (dataFile.errors.length !== 0) {
                return (
                    <Alert
                        severity="error"
                        key={dataFile.file.name}
                        onClose={() => handleRemoveDataFile(dataFile.file.name)}
                        sx={{mt: 2}}
                    >
                        <AlertTitle>{dataFile.file.name}</AlertTitle>
                        <ul>
                            {dataFile.errors.map(error => (
                                <li key={error.msg}>{error.msg}</li>
                            ))}
                        </ul>
                    </Alert>
                );
            }
            return (
                <Alert
                    severity="success"
                    key={dataFile.file.name}
                    onClose={() => handleRemoveDataFile(dataFile.file.name)}
                    sx={{mt: 2}}
                >
                    {dataFile.file.name}
                </Alert>
            );
        });
    };

    return (
        <Box>
            <LoadDataFilesInput
                allowedFormats={allowedFormats}
                handleLoadedDataFile={handleLoadedDataFile}
            />
            <Typography variant="caption">
                Extensiones permitidas ({allowedFormats.join(",")})
            </Typography>
            {renderDataFiles()}
        </Box>
    );
};

export default LoadDataFileUploadArea;
