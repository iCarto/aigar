class PaymentImportedData {
    constructor(id, data) {
        this.id = id + "-" + data.invoice;
        this.invoice = data.invoice;
        this.date = data.date;
        this.amount = data.amount;
        this.branchOffice = data.branchOffice;
        this.location = data.location;
    }
}

export default PaymentImportedData;
