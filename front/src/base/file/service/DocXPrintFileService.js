import createReport from "docx-templates";
import FileService from "./FileService";
import BarcodeService from "./BarcodeService";
import logoAscatliPath from "assets/print-templates/invoice/logo_ascatli.png";
// import invoiceTemplatePath from "media/plantilla_factura.docx";
import {DateUtil, NumberUtil} from "base/format/utilities";

window.Buffer = window.Buffer || require("buffer").Buffer;

const invoiceTemplatePath = "media/plantilla_factura.docx";

const DocXPrintFileService = {
    async getLogoAscatli() {
        const IMAGE_WITDH = 2.4;
        const IMAGE_HEIGHT = 2.4;
        const logo = await FileService.readPublicFileAsArrayBuffer(logoAscatliPath);
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
            width: 6.5,
            height: 1.9,
            data: barcode,
            extension: ".png",
        };
    },

    async generateInvoicesDocument(data, outputFilename) {
        // For browser execution template should be an ArrayBuffer
        const invoicesDocumentTemplate = await FileService.readPublicFileAsArrayBuffer(
            invoiceTemplatePath
        );

        const logoAscatli = await this.getLogoAscatli();
        const invoicesDocument = await createReport({
            template: invoicesDocumentTemplate,
            output: outputFilename + ".docx",
            data,
            additionalJsContext: {
                // To avoid "this.getLogoAscatli()" function on every loop iteration
                // The logo should be initialized before the call to createReport()
                getLogoAscatli: () => {
                    return logoAscatli;
                },
                getInvoiceBarcode: this.getInvoiceBarcode,
                getMonthName: DateUtil.getMonthName,
                getDecimal: NumberUtil.formatFloat,
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
