import {useState, useRef} from "react";

import {LoadDataFile} from "loaddata/model";
import {Spinner} from "base/ui/other/components";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const LoadDataFilesInput = ({allowedFormats, handleLoadedDataFile}) => {
    const [loading, setLoading] = useState(false);

    const inputRef = useRef(null);

    const triggerInputClick = () => {
        inputRef.current.click();
    };

    const handleFileRead = async file => {
        return new Promise(resolve => {
            let fileReader = new FileReader();
            fileReader.onload = function (evt) {
                const loadDataFile = new LoadDataFile({
                    file,
                    content: evt.target.result,
                });
                resolve(loadDataFile);
            };
            fileReader.readAsText(file);
        });
    };

    const handleFileChosen = async filesToRead => {
        setLoading(true);

        const fileReadPromises = Array.from(filesToRead).map(handleFileRead);

        try {
            const loadDataFiles = await Promise.all(fileReadPromises);
            setLoading(false);
            loadDataFiles.forEach(loadDataFile => {
                handleLoadedDataFile(loadDataFile);
            });
        } catch (error) {
            console.error("Error reading files:", error);
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="start">
            <input
                type="file"
                id="file"
                hidden
                ref={event => {
                    inputRef.current = event;
                }}
                accept={allowedFormats.join(",")}
                onChange={e => handleFileChosen(e.target.files)}
                aria-describedby="fileUploadHelp"
                multiple
            />
            <Button onClick={triggerInputClick} variant="outlined">
                Seleccione los archivos...
            </Button>
            {loading ? <Spinner message="Subiendo archivo" /> : null}
        </Box>
    );
};

export default LoadDataFilesInput;
