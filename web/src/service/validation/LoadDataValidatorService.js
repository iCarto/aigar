import CSVFileValidator from "./model/CSVFileValidator";
import DataValidator from "./model/DataValidator";
import JSONFileValidator from "./model/JSONFileValidator";

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
                        param: [5, 10],
                    },
                ],
            })
        );
    },

    validatePaymentEntry(payment, invoice) {
        const paymentErrors = LoadDataValidatorService.validateEntry(
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
                        param: ["num_socio"],
                    },
                ],
            })
        );
    },

    validateMeasurementEntry(measurement) {
        return LoadDataValidatorService.validateEntry(
            measurement,
            new DataValidator({
                sector: ["isNotEmpty"],
                num_socio: ["isNotEmpty"],
                caudal_anterior: ["isNotEmpty", "isDecimal2"],
                caudal_actual: ["isNotEmpty", "isDecimal2"],
            })
        );
    },
};

export default LoadDataValidatorService;
