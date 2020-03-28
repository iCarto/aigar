import CSVFileValidator from "./model/CSVFileValidator";
import DataValidator from "./model/DataValidator";
import JSONFileValidator from "./model/JSONFileValidator";

const ImportedDataValidatorService = {
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
        return this.validateFile(
            fileObject,
            new CSVFileValidator({
                file: ["extension", "filename"],
                content: [
                    {
                        type: "columns",
                        param: 5,
                    },
                ],
            })
        );
    },

    validatePaymentEntry(entryObject) {
        return this.validateEntry(
            entryObject,
            new DataValidator({
                invoice: [
                    "isNotEmpty",
                    {
                        type: "length",
                        param: 12,
                    },
                ],
                date: ["isNotEmpty", "isDate"],
                amount: ["isNotEmpty", "isDecimal2"],
                branchOffice: ["isNotEmpty"],
                location: ["isNotEmpty"],
            })
        );
    },

    validateMeasurementsFile(fileObject) {
        return this.validateFile(
            fileObject,
            new JSONFileValidator({
                file: ["extension"],
                content: [],
            })
        );
    },

    validateMeasurementEntry(entryObject) {
        return this.validateEntry(
            entryObject,
            new DataValidator({
                sector: ["isNotEmpty"],
                num_socio: ["isNotEmpty"],
                lectura_anterior: ["isNotEmpty", "isDecimal2"],
                lectura: ["isNotEmpty", "isDecimal2"],
                num_contador: ["isNotEmpty", "isInteger"],
                cambio_contador: ["isNotEmpty", "isBoolean"],
            })
        );
    },
};

export default ImportedDataValidatorService;
