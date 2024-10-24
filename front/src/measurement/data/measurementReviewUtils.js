import {createAlertMessage} from "payment/model";

const invoice_match_measurement = (invoice, measurement) => {
    return invoice.member_id === measurement.member_id;
};

export const reviewMeasurementsWithoutInvoice = (measurements, invoices) => {
    if (!invoices.length || !measurements.length) {
        return [];
    }
    return measurements
        .filter(measurement => {
            const invoice = invoices.find(invoice =>
                invoice_match_measurement(invoice, measurement)
            );
            return !invoice;
        })
        .map(
            measurement => `${measurement.member_id} - ${measurement.member_name}    `
        );
};

export const reviewMeasurements = (measurements, invoices) => {
    invoices.forEach(invoice => {
        checkMeasurement(measurements, invoice);
    });
};

const checkMeasurement = (measurements, invoice) => {
    const measurementsForInvoice = measurements.filter(measurement =>
        invoice_match_measurement(invoice, measurement)
    );

    if (measurementsForInvoice.length > 1 || invoice.has_measurements) {
        invoice.errors.push(
            createAlertMessage("error", "El recibo tiene varias lecturas")
        );
    }
    const measurement = measurementsForInvoice[0];

    if (!measurement) {
        invoice.errors.push(
            createAlertMessage(
                "error",
                "El recibo no tiene lectura. Comprueba los nombres y números de socio/a"
            )
        );
        return;
    }

    if (
        invoice.caudal_anterior !== measurement.caudal_anterior &&
        !measurement.cambio_medidor
    ) {
        invoice.errors.push(
            createAlertMessage(
                "error",
                `No coincide la lectura anterior ${invoice.caudal_anterior}")`
            )
        );
    }

    if (!measurementsForInvoice.length && !invoice.caudal_actual) {
        invoice.errors.push(
            createAlertMessage(
                "warning",
                "No se ha encontrado ninguna lectura para el recibo"
            )
        );
    }

    if (invoice.consumo > 30) {
        invoice.errors.push(
            createAlertMessage(
                "warning",
                "El consumo es superior a 30m3. Revise si se debería usar una tarifa de uso comercial"
            )
        );
    }
};
