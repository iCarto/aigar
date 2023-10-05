import CSVFileValidator from "validation/model/CSVFileValidator";
import DataValidator from "validation/model/DataValidator";
import JSONFileValidator from "validation/model/JSONFileValidator";

const LoadDataValidatorService = {
    validateFile(fileObject, validator) {
        let errors = [];
        Object.keys(validator.validations).forEach(validationAttr => {
            let validationErrors = validator.validate(
                fileObject[validationAttr],
                validator.validations[validationAttr]
            );
            if (validationErrors.length > 0) {
                validationErrors.forEach(validationError => {
                    errors.push({
                        type: "error",
                        field: validationAttr,
                        msg: validationError,
                    });
                });
            }
        });
        return errors;
    },

    validateEntry(entryObject, validator) {
        let errors = [];
        Object.keys(validator.validations).forEach(validationAttr => {
            let validationErrors = validator.validate(
                entryObject[validationAttr],
                validator.validations[validationAttr]
            );
            if (validationErrors.length > 0) {
                validationErrors.forEach(validationError => {
                    errors.push({
                        type: "error",
                        field: validationAttr,
                        msg: validationError,
                    });
                });
            }
        });
        return errors;
    },

    validatePaymentsFile(fileObject) {
        return LoadDataValidatorService.validateFile(
            fileObject,
            new CSVFileValidator({
                file: ["extension", "filename"],
                content: [
                    {
                        type: "columns",
                        param: [5, 8],
                    },
                ],
            })
        );
    },

    validatePaymentEntry(payment, invoice) {
        let paymentErrors = LoadDataValidatorService.validateEntry(
            payment,
            new DataValidator({
                num_factura: [
                    "isNotEmpty",
                    {
                        type: "length",
                        param: 12,
                    },
                ],
                fecha: ["isNotEmpty", "isDate"],
                monto: ["isNotEmpty", "isDecimal2"],
            })
        );
        if (!invoice || payment.num_factura !== invoice.numero) {
            paymentErrors.push({
                type: "error",
                field: "num_factura",
                msg: "No existe la factura para este mes",
            });
        }
        if (invoice && (invoice.total == null || invoice.total === "")) {
            paymentErrors.push({
                type: "error",
                field: "num_factura",
                msg: "No se ha indicado el caudal actual en esta factura",
            });
        }
        return paymentErrors;
    },

    validateMeasurementsFile(fileObject) {
        return LoadDataValidatorService.validateFile(
            fileObject,
            new JSONFileValidator({
                file: ["extension"],
                content: [
                    "isJSON",
                    {
                        type: "mandatoryFields",
                        param: ["member_id"],
                    },
                ],
            })
        );
    },

    validateMeasurementEntry(measurement) {
        let measurementErrors = LoadDataValidatorService.validateEntry(
            measurement,
            new DataValidator({
                sector: ["isNotEmpty"],
                member_id: ["isNotEmpty"],
                caudal_anterior: ["isNotEmpty", "isDecimal2"],
                caudal_actual: ["isNotEmpty", "isDecimal2"],
            })
        );
        if (measurement.caudal_actual < measurement.caudal_anterior) {
            measurementErrors.push({
                type: "error",
                field: "caudal_actual",
                msg: "El caudal actual es menor que el caudal actual",
            });
        }
        return measurementErrors;
    },
};

export default LoadDataValidatorService;
