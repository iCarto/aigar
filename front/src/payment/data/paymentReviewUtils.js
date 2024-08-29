import {createAlertMessage} from "payment/model";

export const clearErrors = invoices => {
    invoices.forEach(invoice => {
        invoice.errors.splice(0, invoice.errors.length);
    });
};

export const reviewPayments = (payments, invoices) => {
    invoices.forEach(invoice => {
        checkPayment(payments, invoice);
    });
};

export const reviewInvoices = (payments, invoices) => {
    invoices.forEach(invoice => {
        checkInvoice(payments, invoice);
    });
};

const checkPayment = (payments, invoice) => {
    const paymentsForInvoice = payments.filter(
        payment => invoice.numero === payment.num_factura
    );

    if (!paymentsForInvoice.length) {
        invoice.errors.push(
            createAlertMessage(
                "error",
                "No se ha encontrado ningún pago para el recibo"
            )
        );
        return;
    }
    if (invoice.has_payments) {
        invoice.errors.push(
            createAlertMessage("error", "El recibo ya tenía un pago previo registrado")
        );
        return;
    }

    if (paymentsForInvoice.length > 1) {
        invoice.errors.push(
            createAlertMessage(
                "error",
                "Hay varios pagos para el mismo recibo en el fichero bancario"
            )
        );
        return;
    }
};

const checkInvoice = (payments, invoice) => {
    if (invoice.consumo > 30) {
        invoice.errors.push(
            createAlertMessage(
                "warning",
                "El consumo es superior a 30m3. Revise si se debería usar una tarifa de uso comercial"
            )
        );
    }
    if (invoice.total > invoice.ontime_payment + invoice.late_payment) {
        invoice.errors.push(createAlertMessage("warning", "El pago no cubre el total"));
    }
    if (invoice.total < invoice.ontime_payment + invoice.late_payment) {
        invoice.errors.push(createAlertMessage("warning", "El pago supera el total"));
    }
};
