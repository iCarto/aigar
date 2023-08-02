import {useState} from "react";
import {Spinner} from "base/common";
import {LoadDataFile} from "model";

const LoadDataFilesInput = ({allowedFormats, handleLoadedDataFile}) => {
    const [fileReaders, setFileReaders] = useState([]);

    const handleFileRead = async (evt, file) => {
        setFileReaders(prevFileReaders => {
            const updatedFileReaders = prevFileReaders.filter(
                fileReader => fileReader.filename !== file.name
            );

            const fileReaderInfo = prevFileReaders.find(
                fileReader => fileReader.filename === file.name
            );

            if (fileReaderInfo) {
                const loadDataFile = new LoadDataFile({
                    file,
                    content: fileReaderInfo.reader.result,
                });

                handleLoadedDataFile(loadDataFile);
            }

            return updatedFileReaders;
        });
    };

    const handleFileChosen = filesToRead => {
        const filesArray = Array.from(filesToRead);
        filesArray.forEach(fileToRead => {
            const fileReader = new FileReader();

            fileReader.onloadend = function (evt) {
                handleFileRead(evt, fileToRead);
            };

            fileReader.readAsText(fileToRead);

            setFileReaders(prevFileReaders => [
                ...prevFileReaders,
                {
                    filename: fileToRead.name,
                    reader: fileReader,
                },
            ]);
        });
    };

    const renderFileReaders = () => {
        return fileReaders.map(fileReader => (
            <div key={fileReader.filename}>
                <Spinner message={"Leyendo archivo... " + fileReader.filename} />
            </div>
        ));
    };

    return (
        <div className="d-flex flex-column align-items-start">
            <input
                type="file"
                id="fileUpload"
                className="input-file"
                accept={allowedFormats.join(",")}
                onChange={e => handleFileChosen(e.target.files)}
                aria-describedby="fileUploadHelp"
                multiple
            />
            {renderFileReaders()}
        </div>
    );
};

export default LoadDataFilesInput;
