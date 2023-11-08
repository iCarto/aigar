import createReport from "docx-templates";
import FileService from "./FileService";
import BarcodeService from "./BarcodeService";

window.Buffer = window.Buffer || require("buffer").Buffer;

const logoPath = "http://localhost:8000/media/logo.png";
const invoiceTemplatePath = "http://localhost:8000/media/plantilla_recibo.docx";

const DocXPrintFileService = {
    async getLogo() {
        const IMAGE_WITDH = 2.4;
        const IMAGE_HEIGHT = 2.4;
        const logo = await FileService.readPublicFileAsArrayBuffer(logoPath);
        return {
            width: IMAGE_WITDH,
            height: IMAGE_HEIGHT,
            data: logo,
            extension: ".png",
        };
    },

    async getInvoiceBarcode(invoiceNumber) {
        const barcode = await BarcodeService.generateBarcodeCode39(invoiceNumber);
        return {
            width: 5.49,
            height: 1.77,
            data: barcode,
            extension: ".png",
        };
    },

    async generateInvoicesDocument(data, outputFilename) {
        // For browser execution template should be an ArrayBuffer
        const invoicesDocumentTemplate = await FileService.readPublicFileAsArrayBuffer(
            invoiceTemplatePath
        );

        const logo = await this.getLogo();
        const invoicesDocument = await createReport({
            template: invoicesDocumentTemplate,
            output: outputFilename + ".docx",
            data,
            additionalJsContext: {
                // To avoid "this.getLogo()" function on every loop iteration
                // The logo should be initialized before the call to createReport()
                getLogo: () => {
                    return logo;
                },
                getInvoiceBarcode: this.getInvoiceBarcode,
            },
            /*
            With the default configuration, browser usage can become slow with
            complex templates due to the usage of JS sandboxes for security reasons.
            If the templates you'll be using with docx-templates can be trusted 100%,
            you can disable the security sandboxes by configuring noSandbox: true.
            Beware of arbitrary code injection risks.
            https://github.com/guigrpa/docx-templates/issues/8#issuecomment-358037058
            */
            // USE ONLY IN THE BROWSER, AND WITH TRUSTED TEMPLATES
            noSandbox: true, // WARNING: INSECURE
        });
        return invoicesDocument;
    },
};

export default DocXPrintFileService;
