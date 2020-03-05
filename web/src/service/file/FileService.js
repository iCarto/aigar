const FileService = {
    async readPublicFileAsArrayBuffer(filepath) {
        // Fetch file from public path
        try {
            const fileResponse = await fetch(filepath);
            // Transform file response to Blob
            const fileAsBlob = await fileResponse.blob();
            // Transform Blob file to ArrayBuffer
            const file = await this.readFileIntoArrayBuffer(fileAsBlob);
            return file;
        } catch (err) {
            console.log(err);
        }
    },

    readFileIntoArrayBuffer(fileAsBlob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsArrayBuffer(fileAsBlob);
        });
    },

    saveDataToFile(data, fileName, mimeType) {
        const blob = new Blob([data], {type: mimeType});
        const url = window.URL.createObjectURL(blob);
        this.downloadURL(url, fileName, mimeType);
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 1000);
    },

    downloadURL(data, fileName) {
        const a = document.createElement("a");
        a.href = data;
        a.download = fileName;
        document.body.appendChild(a);
        a.style = "display: none";
        a.click();
        a.remove();
    },
};

export default FileService;
