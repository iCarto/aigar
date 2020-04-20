import {createPayment} from "model";

const PaymentService = {
    getPaymentsFromCSVContent: function(content) {
        let lines = content.split(/\r\n|\r|\n/g);
        let payments = [];
        for (let i = 0; i < lines.length; i++) {
            if (this.isValidLine(lines[i])) {
                const line = lines[i].trim();
                let paymentRead = line.split(";");
                if (paymentRead.length === 1) {
                    paymentRead = line.split(",");
                }
                if (paymentRead.length === 10) {
                    // 10 columns = Tigo Money
                    payments.push(
                        createPayment({
                            num_factura: paymentRead[0],
                            fecha: paymentRead[1],
                            monto: paymentRead[8],
                            errors: [],
                        })
                    );
                } else if (paymentRead.length === 6) {
                    // 6 columns = Banco
                    payments.push(
                        createPayment({
                            num_factura: paymentRead[0],
                            num_socio: paymentRead[1],
                            fecha: paymentRead[2],
                            monto: paymentRead[3],
                            errors: [],
                        })
                    );
                }
            }
        }
        return Promise.resolve(payments);
    },

    isValidLine(line) {
        return line.trim() !== "" && !line.startsWith("CORRELATIVO");
    },

    mergeFileContents(contents) {
        return contents.join("\n");
    },
};

export default PaymentService;
