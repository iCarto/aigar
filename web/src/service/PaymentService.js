import {PaymentImportedData} from "model";

const PaymentService = {
    getPaymentsFromCSVContent: function(content) {
        let lines = content.split(/\r\n|\r|\n/g);
        let payments = [];
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() !== "") {
                let paymentRead = lines[i].split(";");
                let payment = new PaymentImportedData(i, {
                    invoice: paymentRead[0],
                    date: paymentRead[1],
                    amount: paymentRead[2],
                    branchOffice: paymentRead[3],
                    location: paymentRead[4],
                    errors: [],
                });
                payments.push(payment);
            }
        }
        return payments;
    },
};

export default PaymentService;
