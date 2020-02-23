import createReport from "docx-templates";
import FileService from "./FileService";

const DocXPrintFileService = {
    async getLogoAscatli() {
        const IMAGE_WITDH = 2.4;
        const IMAGE_HEIGHT = 2.4;
        const logo = await FileService.readPublicFileAsArrayBuffer(
            "/print-templates/invoice/logo_ascatli.png"
        );
        return {
            width: IMAGE_WITDH,
            height: IMAGE_HEIGHT,
            data: logo,
            extension: ".png",
        };
    },

    async generateInvoicesDocument(data) {
        // For browser execution template should be an ArrayBuffer
        const invoicesDocumentTemplate = await FileService.readPublicFileAsArrayBuffer(
            "/print-templates/invoice/Modelo_Factura_ASCATLI.docx"
        );
        const invoicesDocument = await createReport({
            template: invoicesDocumentTemplate,
            output: "test_output.docx",
            data,
            additionalJsContext: {
                getLogoAscatli: this.getLogoAscatli,
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
