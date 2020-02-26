import CSVFileValidator from "./model/CSVFileValidator";
import DataValidator from "./model/DataValidator";

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
                        id: entryObject.id,
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
            new CSVFileValidator({
                file: ["extension"],
                content: [
                    {
                        type: "columns",
                        param: 4,
                    },
                ],
            })
        );
    },

    validateMeasurementEntry(entryObject) {
        return this.validateEntry(
            entryObject,
            new DataValidator({
                sector: ["isNotEmpty"],
                memberNumber: ["isNotEmpty"],
                measurementDate: ["isNotEmpty", "isDate"],
                currentMeasurement: ["isNotEmpty", "isDecimal2"],
            })
        );
    },
};

export default ImportedDataValidatorService;
