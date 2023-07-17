import JsBarcode from "jsbarcode";
import FileService from "./FileService";

const BarcodeService = {
    generateBarcodeCode39(text) {
        return new Promise(resolve => {
            var canvas = document.createElement("canvas");
            JsBarcode(canvas, text, {format: "CODE39"});
            canvas.toBlob(blob => {
                resolve(FileService.readFileIntoArrayBuffer(blob));
            });
        });
    },
};

export default BarcodeService;
