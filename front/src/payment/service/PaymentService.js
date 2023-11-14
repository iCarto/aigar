import {createPaymentFromBankCSV} from "payment/model";

const PaymentService = {
    getPaymentsFromCSVContent: function (content) {
        let lines = content.split(/\r\n|\r|\n/g);
        let payments = [];
        for (let i = 0; i < lines.length; i++) {
            if (this.isValidLine(lines[i])) {
                const line = lines[i].trim();
                let paymentRead = line.split(";");
                if (paymentRead.length === 1) {
                    paymentRead = line.split(",");
                }

                payments.push(
                    createPaymentFromBankCSV({
                        num_factura: paymentRead[0],
                        fecha: paymentRead[1],
                        monto: paymentRead[2],
                        errors: [],
                    })
                );
            }
        }
        return Promise.resolve(payments);
    },

    isValidLine(line) {
        // "CORRELATIVO" or "Record" are the first word of header lines in some example files received from banks
        // We don't know exactly that format, so we check that special words to claim that a line is valid
        return (
            line.trim() !== "" &&
            !line.startsWith("CORRELATIVO") &&
            !line.startsWith("Record")
        );
    },

    mergeFileContents(contents) {
        return contents.join("\n");
    },
};

export default PaymentService;
